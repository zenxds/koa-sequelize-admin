import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Spin } from 'antd'

import * as decorators from '@decorators'
import LayoutMain from '@components/Layout/Main'
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
    const { admin } = this.props.store.config

    if (!admin) {
      return (
        <div className="page-loading">
          <Spin />
        </div>
      )
    }

    return (
      <LayoutMain title={`${admin.name}管理`}>
        <Toolbar history={this.props.history} />
        <Table history={this.props.history} />
      </LayoutMain>
    )
  }
}
