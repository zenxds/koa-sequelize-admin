import BaseActions from '@components/BaseActions'
import * as apis from '../constants/apis'
import store from '../store'

class Actions extends BaseActions {
  getList = (params = {}) => {
    const { model } = this.store
    return this.get(apis.API_GET_LIST + `/${model}`, params)
  }

  createItem = (params = {}) => {
    const { model } = this.store
    return this.post(apis.API_CREATE_ITEM + `/${model}`, params)
  }

  editItem = (params = {}) => {
    const { model } = this.store
    return this.post(apis.API_EDIT_ITEM + `${model}`, params)
  }

  deleteItem = (params = {}) => {
    return this.post(apis.API_DELETE_ITEM, params)
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
