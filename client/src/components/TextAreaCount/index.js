import React, { Component } from 'react'
import { Input } from 'antd'

const TextArea = Input.TextArea
import './less/styles.less'

class TextAreaCount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: props.value ? props.value.length : 0,
    }
  }

  render() {
    return (
      <div styleName="textarea-box">
        <TextArea
          {...this.props}
          onChange={event => {
            this.props.onChange(event)
            this.setState({
              count: event.target.value.length,
            })
          }}
        />

        <div styleName="count">字数：{this.state.count}</div>
      </div>
    )
  }
}

export default TextAreaCount
