import React, { Component } from 'react'
import { Transfer } from '@dx/xbee'

class MyTransfer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      targetKeys: props.targetKeys || [],
      selectedKeys: props.selectedKeys || []
    }
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys })
    // 必须，否则数据不会变化
    this.props.onChange && this.props.onChange(nextTargetKeys, direction, moveKeys)
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
  }

  render() {
    return (
      <Transfer
        {...this.props}
        targetKeys={this.state.targetKeys}
        selectedKeys={this.state.selectedKeys}
        onSelectChange={this.handleSelectChange}
        onChange={this.handleChange}
      />
    )
  }
}

export default MyTransfer
