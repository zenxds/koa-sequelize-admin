import { observable, computed } from 'mobx'

class Store {
  // 触发获取数据用
  @observable pageFetchId = 0
  // 查询条件
  @observable pageConditions = observable.map({})

  @observable model = ''
  @observable config = {}

  @computed get primaryKeyAttribute() {
    return this.config.admin.primaryKey.fieldName
  }

  @observable loading = false
}

export default new Store()
