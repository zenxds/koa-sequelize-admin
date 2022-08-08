import { observable, computed } from 'mobx'

class Store {
  @observable loading = false
  // 触发获取数据用
  @observable pageFetchId = 0
  // 查询条件
  @observable pageConditions = observable.map({})

  @observable model = ''
  @observable config = {}

  @computed get primaryKeyAttribute() {
    return this.config.admin?.primaryKeyAttribute
  }

  getFieldOptions(field) {
    return this.config.associationOptions[field] || this.config.admin.fields[field]?.options || []
  }
}

export default new Store()
