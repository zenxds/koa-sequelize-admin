import BaseActions from '@components/BaseActions'
import * as apis from '../constants/apis'
import store from '../store'

class Actions extends BaseActions {
  createItem = (params = {}) => {
    const { model } = this.store
    return this.post(apis.API_CREATE_ITEM + `/${model}`, params, {
      compact: false
    })
  }

  editItem = (params = {}) => {
    const { model } = this.store
    return this.post(apis.API_EDIT_ITEM + `/${model}`, params, {
      compact: false
    })
  }

  getItemDetail = (params = {}) => {
    const { model } = this.store
    return this.get(apis.API_ITEM_DETAIL + `/${model}`, params)
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
