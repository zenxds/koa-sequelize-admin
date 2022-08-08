import { observable } from 'mobx'

class Store {
  @observable loading = false

  @observable model = ''
  @observable config = {}

  getFieldOptions(field) {
    return this.config.associationOptions[field] || this.config.admin.fields[field]?.options || []
  }
}

export default new Store()
