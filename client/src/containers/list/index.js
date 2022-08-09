import { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { Spin } from 'antd'

import * as decorators from '@decorators'
import Toolbar from './components/Toolbar'
import Table from './components/Table'
import actions from './action'
import store from './store'
import './styles.less'

@decorators.provider({
  actions,
  store,
})
@inject('actions', 'store')
@observer
export default class Page extends Component {
  componentDidMount() {
    const { model } = this.props.match.params
    this.props.actions.getConfig(model)
  }

  componentWillUnmount() {
    this.props.actions.merge({
      model: '',
      config: {},
    })
  }

  render() {
    const { name } = this.props.store.config

    if (!name) {
      return (
        <div className="page-loading">
          <Spin />
        </div>
      )
    }

    return (
      <Fragment>
        <Toolbar history={this.props.history} />
        <Table history={this.props.history} />
      </Fragment>
    )
  }
}
