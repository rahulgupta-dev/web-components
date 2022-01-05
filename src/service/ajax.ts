import { v4 as uuid } from 'uuid'

let loadingPromise = Promise.resolve({})
declare let csrfReqToken: any

export class Ajax {

  static get(url: string, opts: any = {}): Promise<any> {
    opts.method = 'get'
    return Ajax.send(url, null, opts)
  }

  static post(url: string, data: any, opts: any = {}): Promise<any> {
    opts.method = 'post'
    return Ajax.send(url, data, opts)
  }

  static sendRequest(req: any, opts: any = {}): Promise<any> {
    return Ajax.post('/defaultUrl', req, opts)
  }

  static waiting(milliSeconds: number): Promise<any> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({})
      }, milliSeconds)
    })
  }



  static send(url: string, data: any, opts: any = {}): Promise<any> {
    let req: any
    let reqId: string = uuid()
    let result2 = loadingPromise.then(() => {
      let result = new Promise((resolve, reject) => {
        let isGet = opts.method && opts.method === 'get'
        let queryParams = opts.queryParams || {}
        queryParams['rnd'] = uuid()
        if (isGet) {
          req = $.get(`${url}?${$.param(queryParams)}`)
        } else {
          data.csrfReqToken = csrfReqToken
          req = $.post(`${url}?${$.param(queryParams)}`, data)
        }

        req.done((res: any) => {
          Ajax.removeRequest(reqId)
          resolve(res)
        }).fail((err: any) => {
          Ajax.removeRequest(reqId)
          if (err.response && err.response.body) {
            let r = err.response.body
            reject(r)
          } else if (err.timeout) {
            reject('RESPONSE_ERROR_TIMEOUT')
          } else {
            reject('RESPONSE_ERROR_FAILED')
          }
        })
      })
      req.setRequestHeader('Content-Type', opts.contentType || 'application/json')

      result['id'] = reqId
      Ajax.addRequest(reqId, req)

      return result
    })

    result2['id'] = reqId
    return result2
  }

  static _resuestsMap: Map<string, any> = new Map();

  static addRequest(reqId: string, req: any): void {
    Ajax._resuestsMap.set(reqId, req)
  }

  static removeRequest(reqId: string): void {
    Ajax._resuestsMap.delete(reqId)
  }

  static abortRequest(reqId: string): void {
    if (Ajax._resuestsMap.has(reqId)) {
      try {
        Ajax._resuestsMap.get(reqId).abort()
      } catch (e) {
        Ajax.removeRequest(reqId)
        // ignore abort error
      } finally {
        Ajax.removeRequest(reqId)
      }
    }
  }
}

