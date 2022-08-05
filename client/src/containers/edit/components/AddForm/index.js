import { createRef } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Form, Button, message } from '@dx/xbee'

import { compact } from '@utils'
import BaseForm from '@components/BasePage/form'

@inject('actions', 'store')
@observer
export default class AddForm extends BaseForm {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
    this.formRef = createRef()
  }

  getInitialValues() {
    const { store } = this.props
    const adminConfig = toJS(store.config.admin)
    const fields = adminConfig.fields
    const ret = {}

    for (let i in fields) {
      const field = fields[i]

      if (field.defaultValue !== undefined) {
        ret[i] = field.defaultValue
      }
    }

    return ret
  }

  onFinish = async(values) => {
    const { actions, store } = this.props

    this.setState({
      loading: true
    })

    const ret = await actions.createItem(compact(values))
    if (ret) {
      message.success('新增成功')
      this.props.history.push(`/model/${store.model}`)
    }

    this.setState({
      loading: false
    })
  }

  render() {
    const { store } = this.props
    const { config } = store
    const adminConfig = toJS(config.admin)
    const fields = adminConfig.fields

    return (
      <Form
        ref={this.formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={this.getInitialValues()}
        onFinish={this.onFinish}
      >
        {
          this.renderFields()
        }
        {
          this.renderAssociations()
        }
        <Form.Item
          wrapperCol={{ offset: 6, span: 14 }}
        >
          <Button loading={this.state.loading} type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    )
  }
}
