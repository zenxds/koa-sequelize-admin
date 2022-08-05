import { keyBy } from '@utils'
import BaseActions from '@components/BaseActions'
import * as apis from '../constants/apis'
import store from '../store'

class Actions extends BaseActions {
  getList = (params = {}) => {
    const { model } = this.store
    return this.get(apis.API_GET_LIST + `/${model}`, params)
  }

  deleteItem = (params = {}) => {
    const { model } = this.store
    return this.post(apis.API_DELETE_ITEM + `/${model}`, params)
  }

  getConfig = async(model) => {
    const config = await this.get(apis.API_CONFIG + `/${model}`)

    if (config) {
      this.merge({
        model,
        config
      })
    }
  }
}

export default new Actions(store)
