import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { ClickOutside } from 'stencil-click-outside'
import { Util } from '../../utils'
@Component({
  tag: 'mep-operations',
  styleUrl: 'mep-operations.scss'
})
export class MepOperations {

  @Element() $el: HTMLElement

  @Prop() name: string
  @Prop() operations: string
  @Prop() label: string

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
    const opList = JSON.parse(this.operations)
    return (
      <div class={`mep-operations ${this.isOpen ? 'open' : ''}`} onClick={this.openClose.bind(this)} >
        <div>
          <button class="more-btn">
            <span class="more-dot"></span>
            <span class="more-dot"></span>
            <span class="more-dot"></span>
          </button>
          <ul style={this.ulStyle}>{opList.map(op => <li onClick={this.cellClickEvent.emit.bind(this, op)}>
            {op.icon && <i class={`${op.icon} mx-branding-text`}></i>}
            <span class="ellipsify-title">{op.text}</span></li>
          )}</ul>
        </div>
      </ div>
    )
  }

}
