import { Component, createRef } from 'react'
import { Button } from '@dx/xbee'

import './styles.less'

export default class Toolbar extends Component {
  constructor(props) {
    super(props)

    this.formRef = createRef()
  }

  handleSearch = async () => {
    const { actions } = this.props
    const values = await this.formRef.current?.validateFields()

    actions.mergeConditions('page', values)
    this.props.actions.merge({
      pageFetchId: new Date().getTime(),
    })
  }

  handleReset = () => {
    this.formRef.current?.resetFields()
    this.props.actions.resetConditions('page')
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.props.actions.mergeConditions('page', {
      [type]: value,
    })
  }

  renderActions() {
    const { store } = this.props

    return (
      <div styleName="actions">
        <Button type="primary" onClick={this.handleSearch} loading={store.loading}>查询</Button>
        <Button onClick={this.handleReset}>重置</Button>
      </div>
    )
  }
}
