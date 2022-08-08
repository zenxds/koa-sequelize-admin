import { observable } from 'mobx'

class Store {
  @observable loading = false

  // 触发获取数据用
  @observable pageFetchId = 0
  // 查询条件
  @observable pageConditions = observable.map({})
}

export default new Store()
