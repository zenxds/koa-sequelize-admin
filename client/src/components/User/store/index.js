import { observable, computed } from 'mobx'

class Store {
  @observable isLogin = !!window.user
  @observable user = window.user || {}

  @computed get username() {
    return this.user.loginName || this.user.phoneNumber || this.user.email
  }
}

export default new Store()
