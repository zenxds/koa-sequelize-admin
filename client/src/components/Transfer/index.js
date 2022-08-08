import React, { Component } from 'react'
import { Transfer } from '@dx/xbee'

class MyTransfer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value || [],
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return 'value' in nextProps
      ? {
          value: nextProps.value,
        }
      : null
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ value: nextTargetKeys })
    // 必须，否则数据不会变化
    this.props.onChange &&
      this.props.onChange(nextTargetKeys, direction, moveKeys)
  }

  render() {
    return (
      <Transfer
        {...this.props}
        targetKeys={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
}

export default MyTransfer
