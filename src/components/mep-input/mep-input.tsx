import { Component, Element, h, Prop, State } from '@stencil/core'

@Component({
  tag: 'mep-input',
  styleUrl: 'mep-input.scss'
})
export class MepInput {

  @Element() $el: HTMLElement

  @Prop() name: string
  @Prop() placeholder: string
  @Prop() value: string
  @Prop() type: string
  @Prop() label: string

  @State() isChecked: boolean = false

  componentDidLoad() {
    this.$el.querySelector(`[name=${this.name}]`).addEventListener('value-changed', (event: CustomEvent) => {
      if (!event.detail.value) {
        this.isChecked = false
      }
    })
  }

  onInput(event) {
    this.value = event.target.value
  }
  handleChange(event) {
    this.isChecked = event.target.checked
  }
  render() {
    let inputElem = null
    switch (this.type) {
      case 'checkbox':
        inputElem = <label class="mep-input">
          <span class={this.isChecked ? "mep-checkbox__input is-checked" : "mep-checkbox__input"}>
            <span class={this.isChecked ? "mep-checkbox__inner mx-branding-background mx-branding-border important" : "mep-checkbox__inner"} />
            <input type="checkbox" aria-hidden="false" name={this.name} class="mep-checkbox__original" value="" onClick={this.handleChange.bind(this)} />
          </span><span class="mep-checkbox__label">{this.label}</span></label >
        break
      case 'radio':
        inputElem = <label class="mep-input" aria-checked="true">
          <span class={this.isChecked ? "mep-radio__input is-checked" : "mep-radio__input"}>
            <span class={this.isChecked ? "mep-radio__inner mx-branding-background mx-branding-border important" : "mep-radio__inner"} />
            <input type="radio" aria-hidden="true" name={this.name} tabindex="-1" class="mep-radio__original" value={this.value} onClick={this.handleChange.bind(this)} />
          </span>
          <span class="mep-radio__label">{this.label}</span>
        </label>
        break
      default:
        inputElem = <div class="mep-input">
          {this.label && this.value ? <label>{this.label}</label> : ''}
          <input class="mx-branding-border-action"
            name={this.name}
            type={this.type}
            value={this.value}
            placeholder={this.placeholder}
            onInput={this.onInput.bind(this)} />
        </div>
        break
    }
    return (
      inputElem
    )
  }

}
