import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import axios from 'axios'
import { Modal } from 'antd'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './editor.less'

import FullScreen from './FullScreen'

const UPLOAD_URL = window.UPLOAD_URL || 'https://fe.dingxiang-inc.com/upload/image'
const UPLOAD_FIELD = window.UPLOAD_FIELD || 'image'
const IMAGE_PATH = window.IMAGE_PATH || 'https://cdn.dingxiang-inc.com/images/'

export default class MyEditor extends Component {
  constructor(props) {
    super(props)

    if (props.value) {
      const contentBlock = htmlToDraft(props.value)
      if (contentBlock) {
        const { contentBlocks, entityMap } = contentBlock
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

  handleEditorStateChange = (editorState) => {
    this.setState({
      editorState
    })

    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const html = draftToHtml(rawContentState)
    this.props.onChange && this.props.onChange(html)
  }

  render() {
    return (
      <div className="dx-editor-box">
        <Editor
          wrapperClassName="dx-editor-wrapper"
          editorClassName="dx-editor"
          toolbarClassName="dx-toolbar"
          editorState={this.state.editorState}
          onEditorStateChange={this.handleEditorStateChange}
          toolbar={{
            image: {
              uploadEnabled: true,
              uploadCallback: (file) => {
                const formData = new FormData()
                formData.append(UPLOAD_FIELD, file)

                return axios({
                  url: UPLOAD_URL,
                  method: 'POST',
                  data: formData,
                  withCredentials: true
                }).then(response => {
                  const { success, data, message } = response.data

                  if (success) {
                    return {
                      data: {
                        link: IMAGE_PATH + data.path
                      }
                    }
                  } else {
                    throw new Error(message || '上传失败')
                  }
                }).catch(err => {
                  Modal.error({
                    title: err.message,
                    content: err + ''
                  })
                  throw err
                })
              }
            }
          }}
          toolbarCustomButtons={[<FullScreen key="fullscreen" />]}
        />
      </div>
    )
  }
}
