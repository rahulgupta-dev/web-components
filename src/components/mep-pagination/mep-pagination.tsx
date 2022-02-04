import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'
import { i18n } from '../../i18n/translator'
@Component({
  tag: 'mep-pagination',
  styleUrl: 'mep-pagination.scss'
})
export class MepPagination {
  @Prop({ attribute: 'page-size' }) pageSize: number = 20
  @Prop({ attribute: 'total-count' }) totalCount: number = 0
  @Prop({
    attribute: 'current-page',
    mutable: true,
    reflect: true
  }) currentPage: number = 1
  @Prop({ attribute: 'max-button' }) maxVisibleButtons: number = 5

  @Event({
    eventName: 'page-change',
    cancelable: true,
    composed: false
  }) pageChange: EventEmitter

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize)
  }
  get isInFirstPage() {
    return this.currentPage === 1
  }
  get isInLastPage() {
    return this.currentPage === this.totalPages || this.totalCount === 0
  }
  get startPage() {
    if (this.currentPage === 1) {
      return 1
    }
    if (this.currentPage === this.totalPages && this.totalPages > this.maxVisibleButtons) {
      return this.totalPages - this.maxVisibleButtons + 1
    }
    if (this.currentPage > this.maxVisibleButtons) {
      return this.currentPage - this.maxVisibleButtons + 1
    }
    return this.currentPage - 1
  }
  get endPage() {
    return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages)
  }
  get pages() {
    const range = []
    for (let i = this.startPage; i <= this.endPage; i += 1) {
      range.push(i)
    }
    return range
  }

  pageChangeHandler(page) {
    if (page !== this.currentPage) {
      switch (page) {
        case 'PREV':
          this.currentPage--
          break
        case 'NEXT':
          this.currentPage++
          break
        default:
          this.currentPage = page
          break
      }
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      } else if (this.currentPage < 1) {
        this.currentPage = 1
      } else {
        this.pageChange.emit(this.currentPage)
      }
    }
  }

  render() {
    return (
      <div class="mep-pagination">
        <div>Total Records: {this.totalCount}</div>
        {this.totalPages > 1 &&
          <nav aria-label="Page navigation">
            <ul class="pagination" id="pagination">
              <li class={`page-item first ${this.isInFirstPage && 'disabled'}`}>
                <a href="#" class="page-link" onClick={this.pageChangeHandler.bind(this, 1)} data-i18n="next">{i18n['first']}</a>
              </li>
              <li class={`page-item prev ${this.isInFirstPage && 'disabled'}`}>
                <a href="#" class="page-link" onClick={this.pageChangeHandler.bind(this, 'PREV')} data-i18n="next">{i18n['previous']}</a>
              </li>
              {
                this.pages.map(p =>
                  <li class={`page-item ${this.currentPage === p && 'active'}`}>
                    <a href="#"
                      class={`page-link mx-branding-background-action ${this.currentPage == p && 'mx-branding-background important'}`}
                      onClick={this.pageChangeHandler.bind(this, p)}>{p}</a>
                  </li>
                )
              }
              <li class={`page-item next ${this.isInLastPage && 'disabled'}`}>
                <a href="#" class="page-link" onClick={this.pageChangeHandler.bind(this, 'NEXT')} data-i18n="next">{i18n['next']}</a>
              </li>
              <li class={`page-item last ${this.isInLastPage && 'disabled'}`}>
                <a href="#" class="page-link" onClick={this.pageChangeHandler.bind(this, this.totalPages)} data-i18n="next">{i18n['last']}</a>
              </li>
            </ul>
          </nav>
        }
      </div>
    )
  }
}
