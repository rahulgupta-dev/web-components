import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ClickOutside } from 'stencil-click-outside'
import { Util } from '../../utils'
import { i18n } from '../../i18n/translator'
import { ACLMap } from '../../service'
@Component({
  tag: 'mep-operations',
  styleUrl: 'mep-operations.scss'
})
export class MepOperations {

  @Element() $el: HTMLElement

  @Prop() name: string
  @Prop() operations: string
  @Prop() label: string
  @Prop({ attribute: 'acl-id' }) aclId: string

  @State() isOpen: boolean = false
  @State() top: number
  @State() left: number

  parentScrollElement: HTMLElement

  @Event({
    eventName: 'perform-operation',
    composed: true,
    cancelable: true,
    bubbles: false,
  }) cellClickEvent: EventEmitter

  get ulStyle() {
    return { top: `${this.top}px`, left: `${this.left}px`, position: 'fixed' }
  }

  get operationList() {
    return JSON.parse(this.operations).filter(op => {
      return !op.aclIds || op.aclIds.some(id => ACLMap[id])
    })
  }

  @ClickOutside()
  openClose(event) {
    if (event) {
      this.isOpen = !this.isOpen
    } else {
      this.isOpen = false
    }
    if (this.isOpen) {
      this.updatePosition(false)
    }
  }

  updatePosition(isScrolling) {
    const bound = this.parentScrollElement ? this.parentScrollElement.getBoundingClientRect() : this.$el.getBoundingClientRect()
    const { top: containerTop, left: containerLeft, right: containerRight, bottom: containerBottom } = bound
    const { offsetHeight, offsetWidth } = this.$el.querySelector('ul')
    const { top, left, bottom, right, height } = this.$el.getBoundingClientRect()
    const { innerHeight, innerWidth } = window
    if (isScrolling) {
      this.isOpen = !((top + 10 < containerTop)
        || (bottom - 10 > containerBottom)
        || (left + 10 < containerLeft)
        || (right - 10 > containerRight))
    }
    if (this.isOpen) {
      if ((innerHeight - top) > (offsetHeight + 20)) {
        this.top = top + (height - 5)
      } else {
        this.top = top - offsetHeight
      }
      if ((innerWidth - left) > (offsetWidth + 20)) {
        this.left = left + 10
      } else {
        this.left = (left - offsetWidth) + 10
      }
    }
  }

  componentDidLoad() {
    this.parentScrollElement = Util.getFirstScrollParent(this.$el)
    this.parentScrollElement.addEventListener('scroll', () => {
      if (this.isOpen) {
        this.updatePosition(true)
      }
    })
  }

  render() {
    return (
      <div class={`mep-operations ${this.isOpen ? 'open' : ''}`} onClick={this.openClose.bind(this)} >
        <div>
          <button class="more-btn">
            <span class="more-dot"></span>
            <span class="more-dot"></span>
            <span class="more-dot"></span>
          </button>
          <ul style={this.ulStyle}>{this.operationList.map(op => <li onClick={this.cellClickEvent.emit.bind(this, op)}>
            {op.icon && <i class={`${op.icon} mx-branding-text`}></i>}
            <span class="ellipsify-title" data-i18n={op.label}>{i18n[op.label]}</span></li>
          )}</ul>
        </div>
      </ div>
    )
  }

}
