export class Util {

  static regex_simpleTemplate = /\${([\w\.$-]+)(?:\:([\w\.$]*)(?:\((.*?)?\))?)?\}/g;
  static regex_template = /\{{([\w-]+)(?:\:([\w]*)(?:\((.*?)?\))?)?\}}/g;

  static getByPath(root, path, defaultVal = '') {
    if (!path || !root) {
      return defaultVal
    }
    if (!Array.isArray(path)) {
      path = path.split('.')
    }
    for (var i = 0; i < path.length; i++) {
      root = root[path[i]]
      if (root === undefined || root === null) {
        return defaultVal
      }
    }
    return root
  }

  static isDefine(o) {
    return !(o === undefined)
  }

  static isObject(obj) {
    return typeof (obj) === 'object' && obj === Object(obj)
  }

  static format(str: string, data: any) {
    var args, currArgs = arguments
    str = str || ''
    if (currArgs.length === 2) {
      if (Array.isArray(data)) {
        args = data
      } else if (Util.isObject(data)) {
        var formatFn = function (m, name) {
          var val = data[name]
          if (Util.isDefine(val)) {
            return val
          } else {
            return m
          }
        }
        if (str.indexOf('${') >= 0) {
          return str.replace(Util.regex_simpleTemplate, formatFn)
        } else {
          return str.replace(Util.regex_template, formatFn)
        }
      } else {
        args = [].slice.call(arguments, 1)
      }
    } else {
      args = [].slice.call(arguments, 1)
    }
    return str.replace(/\{(\d+)\}/g, function (_m, i) {
      return args[i]
    })
  }

  static generateRowScript(columns) {
    let scriptContent = `
    let tr = []
    let cell, cellHtml, anchor, button, span, icon, formatter, div, ul, li;
    let userLanguage = navigator.language || navigator.userLanguage;
    `
    columns.forEach(col => {
      if (col.sort) {
        Object.defineProperty(col, 'order', {
          value: 'ASC',
          writable: true
        })
      }
      let columnContent = Util.getColumnElement(col)
      scriptContent += `
    cell = document.createElement('td');
    ${columnContent}
    cellHtml.addEventListener('click', function(event){
      if(['action','link','info'].includes('${col.type}') && ${!col.operations}){
        callback.call(this, item, ${JSON.stringify(col)}, event);
      }
    });
    cell.appendChild(cellHtml);
    tr.push(cell);
    `
    })
    scriptContent += `return tr;`
    return scriptContent
  }

  static getColumnElement(col) {
    let content = `cellHtml = document.createElement('div');`
    content += `cellHtml.classList.add('table-cell');`
    content += `cellHtml.classList.add('${col.type || 'text'}');`
    content += `cellHtml.style.width='${col.width || '100px'}';`
    switch (col.type) {
      case 'link':
        content += `anchor = document.createElement('a');`
        content += `anchor.classList.add('ellipsify-title');`
        content += `anchor.innerText= getByPath(item, '${col.path}');`
        content += `anchor.href='#';`
        content += `cellHtml.appendChild(anchor);`
        break
      case 'action':
        if (col.icon) {
          content += `icon = document.createElement('i');`
          content += `icon.className = '${col.icon}';`
          content += `cellHtml.appendChild(icon);`
        } else {
          content += `div = document.createElement('mep-operations');`
          content += `div.setAttribute('operations', '${JSON.stringify(col.operations)}');`
          if (col.aclId) {
            content += `div.setAttribute('acl-id', '${col.aclId}');`
          }
          content += `div.addEventListener('perform-operation', function(event){
          event.stopPropagation();
          callback.call(this, item, event.detail, event);
        });`
          content += `cellHtml.appendChild(div);`
        }
        break
      case 'number':
        content += `span = document.createElement('span');`
        content += `span.classList.add('ellipsify-title');`
        content += `if(getByPath(item, '${col.path}')){
        formatter = new Intl.NumberFormat(userLanguage);
        span.innerText=formatter.format(getByPath(item, '${col.path}'));
        } else {
          span.innerText='';
        }`
        content += `cellHtml.appendChild(span);`
        break
      case 'date':
        content += `span = document.createElement('span');`
        content += `span.classList.add('ellipsify-title');`
        content += `if(getByPath(item, '${col.path}')){
        formatter = moment(parseFloat(getByPath(item, '${col.path}')));
        span.innerText=formatter.format('${col.format || 'DD-MMM-YYYY'}');
        } else {
          span.innerText='';
        }`
        content += `cellHtml.appendChild(span);`
        break
      case 'img':
        content += `span = document.createElement('img');`
        content += `span.src= getByPath(item, '${col.path}');`
        content += `cellHtml.appendChild(span);`
        break
      case 'custom':
        content += `span = window['${col.pathFun}'](item, ${JSON.stringify(col)});`
        content += `cellHtml.appendChild(span);`
        break
      default:
        content += `span = document.createElement('span');`
        content += `span.classList.add('ellipsify-title');`
        content += `span.innerText= getByPath(item, '${col.path}');`
        content += `cellHtml.appendChild(span);`
    }
    return content
  }

  static getFirstScrollParent(element: HTMLElement): HTMLElement {
    if (element == null) {
      return null
    }
    if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
      return element
    } else {
      return this.getFirstScrollParent(element.parentElement)
    }
  }

  static showSpinner() {
    $('.mx-page-content').append('<div class="loader"><div class="spinner"></div></div>')
    $('.loader').fadeIn(200)
  }

  static hideSpinner() {
    $('.mx-page-content').append('')
    $('.loader').hide()
    $('.loader').fadeOut(200)
  }

  static textNodesUnder(node: Node) {
    var all = []
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == 3) all.push(node)
      else all = all.concat(Util.textNodesUnder(node))
    }
    return all
  }

}