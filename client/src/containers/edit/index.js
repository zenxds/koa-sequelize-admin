import { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { Layout, Spin } from '@dx/xbee'

import * as decorators from '@decorators'
import AddForm from './components/AddForm'
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

  render() {
    const { name } = this.props.store.config
    const params = this.props.match.params

    if (!name) {
      return <Spin />
    }

    return (
      <Layout.Main title={name + (params.pk ? '编辑' : '新增')}>
        {
          params.pk ? null : <AddForm history={this.props.history} />
        }
      </Layout.Main>
    )
  }
}
