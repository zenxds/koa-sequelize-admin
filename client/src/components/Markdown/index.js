import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from 'antd'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

// https://github.com/markdown-it/markdown-it
const mdParser = new MarkdownIt({
  html: true,

  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }

    // use external default escaping
    return ''
  },
})

const UPLOAD_URL =
  window.UPLOAD_URL || 'https://fe.dingxiang-inc.com/upload/image'
const UPLOAD_FIELD = window.UPLOAD_FIELD || 'image'
const IMAGE_PATH = window.IMAGE_PATH || 'https://cdn.dingxiang-inc.com/images/'

export default class Markdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  // static getDerivedStateFromProps(nextProps) {
  //   return 'value' in nextProps
  //     ? {
  //         value: nextProps.value,
  //       }
  //     : null
  // }

  handleChange = ({ html, text }) => {
    this.setState({
      value: text,
    })

    this.props.onChange && this.props.onChange(text)
  }

  handleImageUpload = (file, callback) => {
    const formData = new FormData()
    formData.append(UPLOAD_FIELD, file)

    axios({
      url: UPLOAD_URL,
      method: 'POST',
      data: formData,
      withCredentials: true,
    })
      .then(response => {
        const { success, data, message } = response.data

        if (success) {
          callback(IMAGE_PATH + data.path)
        } else {
          throw new Error(message || '上传失败')
        }
      })
      .catch(err => {
        Modal.error({
          title: err.message,
          content: err + '',
        })
        throw err
      })
  }

  render() {
    return (
      <MdEditor
        value={this.state.value}
        style={{ height: '500px' }}
        renderHTML={text => mdParser.render(text)}
        onChange={this.handleChange}
        onImageUpload={this.handleImageUpload}
      />
    )
  }
}
