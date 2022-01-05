import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State } from '@stencil/core'
import ServiceController from '../../service'
import { Util } from '../../utils'
@Component({
  tag: 'mep-listing',
  styleUrl: 'mep-listing.scss'
})
export class MepListing {

  @Element() $el: HTMLElement

  @Prop({ attribute: 'page-size' }) pageSize: number = 20
  @Prop({ attribute: 'list-id' }) listId: string
  @Prop({ mutable: true }) filters: any = ''
  @Prop() url: string

  @State() list: Array<any> = []
  @State() columns: Array<any> = []
  @State() pageNo: number = 1
  @State() isLoading: boolean = false
  @State() appliedFilter: any = {}
  @State() filterOpen: boolean = false
  @State() totalRecords: number = 0

  @Event({
    eventName: 'cell-click',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) cellClickEvent: EventEmitter

  headerSlot: HTMLElement
  filterSlot: HTMLElement
  footerSlot: HTMLElement
  sidePanel: HTMLElement
  cellClick: Function
  generateRowItem: Function

  componentWillLoad() {
    this.headerSlot = this.$el.querySelector('[slot="header"]')
    this.filterSlot = this.$el.querySelector('[slot="filter"]')
    this.sidePanel = this.$el.querySelector('[slot="side-panel"]')
    if (this.sidePanel) {
      const nodes = Util.textNodesUnder(this.sidePanel)
      console.log(nodes)
      nodes.forEach(node => {
        node.data = Util.format(node.data, this)
      })
    }
    this.footerSlot = this.$el.querySelector('[slot="footer"]')
    this.filters = this.filters && JSON.parse(this.filters)
    this.onFirstLoad()
  }
  componentDidLoad() {
    this.registerListeners()
  }
  componentDidRender() {
    this.$el.querySelectorAll('.ellipsify-title').forEach((elem: HTMLElement) => {
      if (parseFloat(window.getComputedStyle(elem).width) === parseFloat(window.getComputedStyle(elem.parentElement).width)) {
        elem.setAttribute('title', elem.textContent)
      }
    })
  }

  get filterList() {
    return this.list || []
  }
  get filterString() {
    let searchString = ''
    if (this.appliedFilter) {
      for (let prop in this.appliedFilter) {
        if (this.appliedFilter[prop]) {
          searchString += `&${prop}_like=${this.appliedFilter[prop]}`
        }
      }
    }
    return searchString
  }
  get filterCount() {
    return Object.values(this.appliedFilter).filter(val => val).length
  }
  get filterTemplate() {
    return this.filterSlot ? <div class="filter">
      <div onClick={this.toggleFilter.bind(this)} class="icon-container">
        <div class={this.filterOpen ? 'filter-icon open' : 'fa fa-filter'} >
          <span />
          <span />
          <span />
          <p class={`filter-badge ${this.filterCount && !this.filterOpen ? 'applied' : 'open'}`} >{this.filterCount}</p>
        </div>
      </div>
      <div class={`mep-filter-content ${this.filterOpen && 'open'}`}>
        <slot name="filter">
          <slot name="header" />
          <slot name="content" />
          <slot name="footer" />
        </slot>
      </div>
      <div class="table-title">
        <slot name="table-title" />
      </div>
    </div> :
      this.filters.length ? <div class="filter">
        <div onClick={this.toggleFilter.bind(this)} class="icon-container">
          <div class={this.filterOpen ? 'filter-icon open' : 'filter-icon'} >
            <i class="fa fa-filter mx-branding-text"></i>
            <span />
            <span />
          </div>
          <span class={`mx-branding-background filter-badge ${this.filterCount && !this.filterOpen ? 'applied' : 'open'}`} >{this.filterCount}</span>
        </div>
        <div class={`mep-filter-content ${this.filterOpen && 'open'}`}>
          <slot name="filter-header" />
          <div id="filterSlot" class="filter-grid">
            {
              this.filters.map(filter => {
                return <div>
                  {
                    filter.type === 'dropdown' ?
                      <mep-dropdown
                        list-id={filter.listId}
                        name={filter.name}
                        label={filter.label}
                        placeholder={filter.placeholder}
                        filter-payload={JSON.stringify(filter.filterPayload)}
                        page-size={filter.pageSize}
                        multiple={filter.multiple}
                        searchable={filter.searchable}>
                      </mep-dropdown>
                      : filter.type === 'date' ?
                        <mep-datepicker
                          name={filter.name}
                          label={filter.label}
                          value={filter.value}
                          is-range={filter.isRange}
                          max-range={filter.maxRange}
                          separator={filter.seperator}
                          from-name={filter.fromName}
                          from-value={filter.fromValue}
                          to-name={filter.toName}
                          to-value={filter.toValue}
                          timezone={filter.timezone}
                          disable-past={filter.disablePast}
                          disable-future={filter.disableFuture}
                          disp-format={filter.dispFormat}
                          data-format={filter.dataFormat}
                          placeholder={filter.placeholder}>
                        </mep-datepicker> :
                        <mep-input
                          type={filter.type}
                          name={filter.name}
                          label={filter.label}
                          value={filter.value}
                          placeholder={filter.placeholder}>
                        </mep-input>
                  }
                </div>
              })
            }
          </div>
          <div class="filter-footer">
            <button class="btn btn-light btn-sm" style={{ 'font-size': '14px' }} onClick={this.resetFilter.bind(this)}>Reset</button>
            <button class="btn btn-primary btn-sm" style={{ 'font-size': '14px' }} onClick={this.filterData.bind(this)}>Apply</button>
          </div>
        </div>
        <div class="table-title">
          <slot name="table-title" />
        </div>
      </div> : ''
    // <div class="filter">
    //   <div class="table-title">
    //     <slot name="table-title" />
    //   </div>
    // </div>
  }

  resetFilter() {
    const filterSlot = this.filterSlot || this.$el.querySelector('#filterSlot')
    let inputs = filterSlot.querySelectorAll("input, select, checkbox, textarea, radio")
    inputs.forEach((input: HTMLInputElement) => {
      if (input.name && input.value || input.checked) {
        input.value = ''
        input.checked = false
        const event = new CustomEvent('value-changed', { detail: { value: '' } })
        input.dispatchEvent(event)
      }
    })
    this.filterData(null, false)
  }
  isFilterChanged(latest) {
    return Object.keys(latest).some(prop => (latest[prop] !== (this.appliedFilter[prop] || '')))
  }
  @Method()
  async filterData(payload, firstCall) {
    this.toggleFilter()
    if (payload && !payload.currentTarget) {
      this.resetFilter()
    } else if (this.filterSlot || this.filters.length) {
      const filterSlot = this.filterSlot || this.$el.querySelector('#filterSlot')
      let inputs = filterSlot.querySelectorAll("input, select, textarea")
      payload = {}
      inputs.forEach((input: HTMLInputElement) => {
        if (input.name) {
          payload[input.name] = input.value
        }
      })
    } else {
      payload = {}
    }
    const callReq = this.isFilterChanged(payload)
    this.appliedFilter = payload
    if (callReq || firstCall) {
      this.pageNo = 1
      this.loadData()
    }
  }
  private loadData() {
    if (!this.isLoading) {
      this.isLoading = true
      Util.showSpinner()
    }
    ServiceController.fetchListData({
      listId: this.listId,
      listUrl: this.url,
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      filter: this.appliedFilter
    }).then(res => {
      this.list = res.data.list
      this.totalRecords = res.data.total
    }).catch((e) => {
      console.log(e)
    }).finally(() => {
      Util.hideSpinner()
      this.isLoading = false
    })
  }

  cellClickHandler(row: any, column: any, event: Event) {
    let callEvent = true
    if (this.cellClick) {
      callEvent && this.cellClick.call(null, { event, detail: { row, column } })
    } else {
      callEvent && this.cellClickEvent.emit({ row, column })
    }
  }
  @Listen('page-change')
  pageCanged(page) {
    this.pageNo = page.detail
    this.loadData()
  }
  toggleFilter() {
    this.filterOpen = !this.filterOpen
  }

  private registerListeners() {
    if (this.filterSlot) {
      const filterBtn = this.filterSlot.querySelector(`#filterBtnId`)
      const resetBtn = this.filterSlot.querySelector(`#resetBtnId`)
      if (filterBtn) {
        filterBtn.addEventListener('click', this.filterData.bind(this))
      }
      if (resetBtn) {
        resetBtn.addEventListener('click', this.resetFilter.bind(this))
      }
    }
    if (this.$el.getAttribute('cell-click')) {
      this.cellClick = window[this.$el.getAttribute('cell-click')]
    }
  }

  private onFirstLoad() {
    Util.showSpinner()
    this.isLoading = true
    ServiceController.fetchListConfig({ listId: this.listId }).then(res => {
      this.columns = res.columnConfig
      this.filters = res.filterConfig ? res.filterConfig : this.filters
      this.generateRowItem = new Function('item', 'callback', 'getByPath', Util.generateRowScript(this.columns))
      const payload = this.filters.length && this.filters.reduce((acc, cur) => {
        acc[cur.name] = cur.value || ''
        return acc
      }, {}) || {}
      this.appliedFilter = Object.keys(this.appliedFilter).length ? this.appliedFilter : payload
      this.loadData()
    }).catch((e) => {
      console.log(e)
    })

  }

  render() {
    let headerSlot = this.headerSlot ? <div class="header"><slot name="header" /></div> : ''
    let footerSlot = this.footerSlot ? <div class="footer"><slot name="footer" /></div> : ''
    const style = { height: `calc(100vh - ${this.$el.getBoundingClientRect().top}px)`, width: `calc(100vw - ${this.$el.getBoundingClientRect().left}px)` }
    let containerStyle = { height: `calc(100% - 40px)` }
    if (this.filterSlot || this.filters.length) {
      containerStyle = { height: `calc(100% - 75px)` }
    }
    return (
      <div class="mep-listing" style={style} >
        {headerSlot}
        {this.filterTemplate}
        <div class="list-container" style={containerStyle}>
          <table>
            <thead>
              <tr>
                {this.columns.map(col => {
                  let st = {}
                  st['--cellWidth'] = `${col.width || '100px'}`
                  return <th><div class="table-header" style={st}><span class="ellipsify-title">{col.label}</span></div></th>
                })}
              </tr>
            </thead>
            <tbody>
              {
                this.filterList.length ?
                  this.filterList.map(item => <tr ref={
                    nodeEle => {
                      while (nodeEle && nodeEle.firstChild) {
                        nodeEle.lastChild.remove()
                      }
                      if (nodeEle) {
                        nodeEle.append(...this.generateRowItem(item, this.cellClickHandler.bind(this), Util.getByPath.bind(this)))
                      }
                    }
                  } />) : <tr style={{ 'border': 'none', 'background': 'none' }} ref={
                    nodeEle => {
                      while (nodeEle && nodeEle.firstChild) {
                        nodeEle.lastChild.remove()
                      }
                      if (nodeEle && !this.isLoading) {
                        nodeEle.innerHTML = '<td class="no-data-found">No Data Found !</td>'
                      }
                    }}></tr>
              }
            </tbody>
          </table >
        </div>
        <mep-pagination page-size={this.pageSize} total-count={this.totalRecords} current-page={this.pageNo} />
        {footerSlot}
      </div >
    )
  }
}