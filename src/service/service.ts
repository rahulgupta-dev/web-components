import { Ajax } from './ajax'

let ACLMap = {}
class ServiceController {
  static _resuestsMap: Map<string, any> = new Map();

  private static listDataUrl = 'loadListData'
  private static listConfigUrl = 'loadListConfig'
  private static dropdownUrl = 'loadDropdown'
  private static aclUrl = 'loadACLData'
  constructor() {
    ServiceController.loadACLData()
  }
  private static loadACLData() {
    Ajax.get(this.aclUrl).then(res => {
      res = JSON.parse(res)
      if (res.code === Ajax.RESPONSE_SUCCESS) {
        ACLMap = res.data.reduce((acc, cur) => {
          acc[cur.acl_id] = true
          return acc
        }, {})
      }
    }).catch(console.trace)
  }
  static fetchListData(payload: any, queryParams: any = {}): Promise<any> {
    const { listId } = payload
    const url = payload.listUrl || this.listDataUrl
    if (this._resuestsMap.get(listId)) {
      Ajax.abortRequest(this._resuestsMap.get(`${listId}`))
    }
    payload.filter = JSON.stringify(payload.filter)
    const req = Ajax.post(url, payload, { queryParams })
    this._resuestsMap.set(listId, req['id'])
    return req.then(res => {
      return res.STATUS ? res : JSON.parse(res)
    }).finally(() => {
      this._resuestsMap.delete(listId)
    })
  }

  static fetchListConfig(payload: any, queryParams: any = {}): Promise<any> {
    const { listId } = payload
    if (this._resuestsMap.get(listId)) {
      Ajax.abortRequest(this._resuestsMap.get(`${listId}`))
    }
    const req = Ajax.post(this.listConfigUrl, payload, { queryParams })
    this._resuestsMap.set(listId, req['id'])
    return req.then(res => {
      return res.STATUS ? res : JSON.parse(res)
    }).finally(() => {
      this._resuestsMap.delete(listId)
    })
  }

  static fetchDropdwonData(payload: any, queryParams: any = {}): Promise<any> {
    const { listId, name } = payload
    if (this._resuestsMap.get(`${listId}-${name}`)) {
      Ajax.abortRequest(this._resuestsMap.get(`${listId}-${name}`))
    }
    const req = Ajax.post(this.dropdownUrl, payload, { queryParams })
    this._resuestsMap.set(`${listId}-${name}`, req['id'])
    return req.then(res => {
      return res.STATUS ? res : JSON.parse(res)
    }).finally(() => {
      this._resuestsMap.delete(`${listId}-${name}`)
    })
  }
}

const serviceController = new ServiceController()
export { ServiceController, serviceController, ACLMap }