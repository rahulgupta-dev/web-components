import { Component, Element, h, Method, Prop, State, Watch } from '@stencil/core'
import { ClickOutside } from 'stencil-click-outside'
import { debounce } from '../../decorators/common'
import { ServiceController } from '../../service'
import { i18n } from '../../i18n/translator'
@Component({
  tag: 'mep-dropdown',
  styleUrl: 'mep-dropdown.scss',
})
export class MepDropdown {

  @Element() $el: HTMLElement

  @Prop() name: string
  @Prop() label: string
  @Prop({ attribute: 'list-id' }) listId: string
  @Prop({ attribute: 'filter-payload' }) filterPayload: any
  @Prop({ attribute: 'page-size' }) pageSize: number = 20
  @Prop() placeholder: string
  @Prop() multiple: boolean = false
  @Prop() items: string
  @Prop() searchable: boolean = false
  @Prop({ mutable: true }) value: string
  @Prop({ attribute: 'dependent-list-id' }) dependentListId: string
  @Prop({ attribute: 'is-dependent' }) isDependent: boolean = false

  @State() searchText: string = ''
  @State() data: Array<any> = []
  @State() isLoading: boolean = false
  @State() selectedItems: Array<any> = []
  @State() deletionIndex: number
  @State() arrowCounter: number = -1
  @State() showList: boolean = false
  @State() isHover: boolean = false
  @State() errorMsg: string

  dependentDropDown: MepDropdown
  lastSelected
  deletionMarkTime
  recentItems = {}
  componentDidLoad() {
    this.$el.querySelector(`[name=${this.name}]`).addEventListener('value-changed', (event: CustomEvent) => {
      if (!event.detail.value) {
        this.selectedItems = []
        this.value = ''
        if (this.dependentDropDown && !this.value) {
          this.dependentDropDown.resetData()
        }
      } else {
        let newItems = []
        event.detail.value.split(',').forEach(key => {
          newItems.push(this.recentItems[key])
        })
        this.selectedItems = newItems
      }
    })
    if (this.dependentListId) {
      this.dependentDropDown = document.querySelector(`[list-id=${this.dependentListId}]`) as any
    }
  }
  componentWillLoad() {
    if (this.items) {
      this.data = JSON.parse(this.items)
    } else if (!this.isDependent) {
      this.loadData()
    }
  }

  @Watch('data')
  watchData() {
    if (this.value) {
      let val = this.data.find(d => d.key === this.value)
      if (val) {
        this.recentItems[this.value] = val
        this.selectedItems = [val]
      }
    }
  }
  @Watch('selectedItems')
  watchSelectedItems() {
    this.errorMsg = ''
  }

  @Method()
  async toggleErrorMsg(msg) {
    this.errorMsg = msg
  }
  @Method()
  async resetData() {
    this.selectedItems = []
    this.data = []
  }
  @Method()
  @debounce(500)
  async loadData(filter = null) {
    if (filter) {
      this.data = []
      this.selectedItems = []
      this.filterPayload = JSON.stringify(filter)
    }
    this.isLoading = true
    ServiceController.fetchDropdwonData(
      {
        listId: this.listId,
        name: this.name,
        pageNo: 1,
        pageSize: this.pageSize,
        filter: this.filterPayload
      }
    ).then(res => {
      this.data = res.data && res.data.list || []
    }).finally(() => {
      this.isLoading = false
    })
  }

  componentDidRender() {
    this.$el.querySelectorAll('.ellipsify-title').forEach((elem: HTMLElement) => {
      if (parseFloat(window.getComputedStyle(elem).width) === parseFloat(window.getComputedStyle(elem.parentElement).width)) {
        elem.setAttribute('title', elem.textContent)
      }
    })
    if (!this.data.length && !this.isDependent) {
      this.loadData()
    }
  }
  get normalizedData() {
    return this.data.filter(item => item.value.toLowerCase().includes(this.searchText) && !this.selectedItems.some(s => s.key === item.key))
  }

  @ClickOutside()
  showHide(value) {
    this.showList = value
    this.onHover(value)
  }
  onHover(value) {
    this.isHover = value
  }
  selectItem(item) {
    this.searchText = ''
    if (this.multiple) {
      const { x, y } = this.$el.querySelector('.mep-user-input-wrapper').getBoundingClientRect()
      if (this.$el.querySelector('.mep-dropdown-input').scrollBy) {
        this.$el.querySelector('.mep-dropdown-input').scrollBy(x, y)
      } else {
        this.$el.querySelector('.mep-dropdown-input').scrollTop = x
        this.$el.querySelector('.mep-dropdown-input').scrollLeft = y
      }
      this.selectedItems = [...this.selectedItems, item]
    } else {
      this.selectedItems = [item]
    }
    this.recentItems = this.selectedItems.reduce((acc, cur) => {
      acc[cur.key] = cur
      return acc
    }, {})
    this.showHide(false)
    if (this.dependentDropDown) {
      this.dependentDropDown.loadData({ query: this.selectedValue })
    }
  }
  get selectedValue() {
    return this.selectedItems.map(item => item.key).join(',') || this.value
  }
  removeItem(item) {
    this.selectedItems = this.selectedItems.filter(i => i.key !== item.key)
    this.lastSelected = null
    this.deletionIndex = null
    this.arrowCounter = -1
    const hiddenElement = this.$el.querySelector(`[name=${this.name}]`) as HTMLInputElement
    hiddenElement.value = this.selectedItems.map(item => item.value).join(',')
    this.value = hiddenElement.value
    if (this.dependentDropDown && !this.value) {
      this.dependentDropDown.resetData()
    }
  }
  keyDown(event) {
    if (this.selectedItems.length < 11) {
      if (event.keyCode === 38 && this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1
        //this.listItemScrolling()
      } else if (event.keyCode === 40) {
        if (this.arrowCounter < this.data.length - 1) {
          this.arrowCounter = this.arrowCounter + 1
          //this.listItemScrolling()
        } else {
          ///this.checkScroll()
        }
      } else if (event.keyCode === 13 && this.arrowCounter > -1) {
        let user = this.data[this.arrowCounter]
        if (user) {
          this.arrowCounter = -1
          this.selectItem(user)
          this.showHide(true)
          //this.$refs.scrollContainer.scrollTop = 0
        }
      }
    }
    if (event.keyCode === 8 && this.searchText.length === 0 && this.selectedItems.length > 0) {
      this.invokeDelete()
    } else {
      this.showHide(true)
    }
  }
  invokeDelete() {
    if (!this.lastSelected) {
      this.deletionIndex = this.selectedItems.length - 1
      this.lastSelected = this.selectedItems[this.deletionIndex]
      this.deletionMarkTime = setTimeout(() => {
        this.lastSelected = null
        this.deletionIndex = null
      }, 1000)
    } else {
      this.showHide(false)
      clearTimeout(this.deletionMarkTime)
      this.removeItem(this.lastSelected)
    }
  }


  handleInput(event) {
    this.searchText = event.target.value
    if (!this.items && this.searchable) {
      if (this.filterPayload) {
        let filter = JSON.parse(this.filterPayload)
        filter.searchKey = this.searchText
        this.filterPayload = JSON.stringify(filter)
      }
      this.loadData()
    }
  }
  render() {
    const multiInput =
      <ul class="mep-user-tags">
        {
          this.selectedItems.map((item, index) => <li class={`mep-user-tag ${this.deletionIndex === index ? 'mep-deletion-mark' : ''}`}>
            <div class="mep-user-content">
              <div class="mep-user-tag-center">
                <span class="ellipsify-title">{item.value}</span>
              </div>
            </div>
            <div class="user-tag-actions">
              <i class="fa fa-times-circle"
                onClick={this.removeItem.bind(this, item)}
              />
            </div>
          </li>)
        }
        <li class="mep-user-input-wrapper">
          <div>
            <input
              type="text"
              class="mep-user-input"
              data-i18n={this.placeholder}
              placeholder={i18n[this.placeholder]}
              value={this.searchText}
              onInput={this.handleInput.bind(this)}
              onFocus={this.showHide.bind(this, true)}
              onKeyDown={this.keyDown.bind(this)} />
          </div>
        </li>
      </ul >
    const singleInput = this.selectedItems.length ? <li class="mep-user-tag single" onClick={this.showHide.bind(this, true)}>
      <div class="mep-user-content">
        <div class="mep-user-tag-center single">
          <span class="ellipsify-title">{this.selectedItems[0].value}</span>
        </div>
      </div>
      <div class="user-tag-actions single">
        <i class="fa fa-times-circle"
          onClick={this.removeItem.bind(this, this.selectedItems[0])}
        />
      </div>
    </li>
      :
      <li class="mep-user-input-wrapper">
        <div>
          <input
            type="text"
            class="mep-user-input"
            data-i18n={this.placeholder}
            placeholder={i18n[this.placeholder]}
            value={this.searchText}
            onInput={this.handleInput.bind(this)}
            onFocus={this.showHide.bind(this, true)}
            onKeyDown={this.keyDown.bind(this)} />
        </div>
      </li>
    const listItems = this.normalizedData.map((item, index) => {
      return <li class={`${index === this.arrowCounter && 'active'}`}
        onClick={this.selectItem.bind(this, item)} key={item.key}>
        <div>
          <span class="ellipsify-title">{item.value}</span>
        </div>
      </li>
    })
    return (
      <div class={this.errorMsg ? "mep-users-input is-error" : "mep-users-input"}
        data-error-msg={this.errorMsg}
        onMouseOver={this.onHover.bind(this, true)}
        onMouseOut={this.onHover.bind(this, false)}>
        <div class={this.showList || this.isHover ? "mx-branding-border mep-dropdown-input important" : "mep-dropdown-input"}>
          {this.label && this.selectedValue ? <label data-i18n={this.label}>{i18n[this.label]}</label> : ''}
          {this.multiple ? multiInput : singleInput}
        </div>
        <div class={this.showList ? "show mep-dropdown-item" : "mep-dropdown-item"}>
          <ul class="select-mep-dropdown-item">
            {listItems}
          </ul>
        </div>
        <input type="hidden" name={this.name} value={this.selectedValue} />
      </div >
    )
  }

}
