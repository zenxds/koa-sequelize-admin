import React, { Component } from 'react'

import './styles.less'

export default class Main extends Component {
  render() {
    const { title, children } = this.props

    return (
      <div styleName="layout">
        <div styleName="header">
          <h2>{title}</h2>
        </div>
        <div styleName="wrapper">
          <div styleName="content">
            { children }
          </div>
        </div>
      </div>
    )
  }
}
