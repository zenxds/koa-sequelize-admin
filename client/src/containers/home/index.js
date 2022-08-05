import { Component } from 'react'
// import { observer, inject } from 'mobx-react'

import * as decorators from '@decorators'
import actions from './action'
import store from './store'
import './styles.less'

@decorators.errorBoundary
@decorators.provider({
  actions,
  store,
})
// @inject('actions')
// @observer
export default class Page extends Component {
  render() {
    return (
      <div></div>
    )
  }
}
