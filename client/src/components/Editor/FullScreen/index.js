import React, { Component, createRef } from 'react'
import {
  toggleFullscreen,
  onFullscreen,
  offFullscreen,
  isFullscreen as getIsFullscreen,
} from './fullscreen'

function getParentUntil(element, className) {
  if (!element) {
    return null
  }

  if (element.classList.contains(className)) {
    return element
  } else {
    do {
      element = element.parentNode

      if (element && element.classList && element.classList.contains(className)) {
        return element
      }
    } while (element)
  }

  return null
}

export default class FullScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFullscreen: false,
    }
    this.ref = createRef()
  }

  handleFullscreenChange = () => {
    this.setState({
      isFullscreen: getIsFullscreen(),
    })
  }

  componentDidMount() {
    onFullscreen(this.handleFullscreenChange)
  }

  componentWillUnmount() {
    offFullscreen(this.handleFullscreenChange)
  }

  toggle() {
    const wrapper = getParentUntil(this.ref.current, 'dx-editor-wrapper')
    if (wrapper) {
      toggleFullscreen(wrapper)
    }
  }

  render() {
    const { isFullscreen } = this.state
    return (
      <div
        ref={this.ref}
        className="rdw-option-wrapper"
        onClick={this.toggle.bind(this)}
      >
        {isFullscreen ? '退出全屏' : '全屏'}
      </div>
    )
  }
}
