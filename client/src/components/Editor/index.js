import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import axios from 'axios'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './editor.less'

import FullScreen from './FullScreen'

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
                formData.append('image', file)

                return axios({
                  url: '/upload',
                  method: 'POST',
                  data: formData,
                }).then(resp => {
                  return {
                    data: {
                      link: 'images/' + resp.path
                    }
                  }
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
