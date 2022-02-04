import { Ajax } from '../service/ajax'
let i18n = {}
class Translator {
  _lang = 'en'
  i18n: any = {}
  constructor() {
    this._lang = this.getLanguage()
  }
  static get i18n() {
    return this.i18n
  }
  getLanguage() {
    const lang = navigator.languages ? navigator.languages[0] : navigator.language
    return window['localeCode'] || lang.substring(0, 2)
  }
  load(lang = null) {
    if (lang) {
      this._lang = lang
    }
    Ajax.get(`${window['contextPath']}/i18n/${this._lang}.json`).then(res => {
      this.i18n = res
      i18n = this.i18n
      this.translate()
    })
  }
  translate() {
    const _elements: any = document.querySelectorAll("[data-i18n]")
    _elements.forEach((element) => {
      let keys = element.dataset.i18n.split(".")
      let text = keys.reduce((obj, i) => obj[i], this.i18n)
      if (text) {
        element.innerHTML = text
      }
    })
  }
}
const translator = new Translator()
translator.load()
window['_i18n'] = translator
export { translator, i18n }