import { observable } from 'mobx'

class Store {
  @observable config = []
}

export default new Store()
