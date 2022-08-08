import { createRef } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import dayjs from 'dayjs'
import { Form, Button, message } from '@dx/xbee'

import { isObject } from '@utils'
import BaseForm from '@components/BasePage/form'

const SUBMIT = 1
const SUBMIT_AND_STAY = 2

@inject('actions', 'store')
@observer
export default class EditForm extends BaseForm {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      submitType: SUBMIT,
      data: null,
    }
    this.formRef = createRef()
  }

  async componentDidMount() {
    const data = await this.props.actions.getItemDetail({
      pk: this.props.pk,
    })

    if (data) {
      this.setState({
        data,
      })
    }
  }

  getInitialValues() {
    const { data } = this.state
    const { store } = this.props
    const adminConfig = toJS(store.config.admin)
    const { fields, associations } = adminConfig
    const ret = {}

    for (let i in fields) {
      const field = fields[i]
      const val = data[i]

      if (val == null) {
        continue
      }

      if (/^(date|dateTime|time)$/.test(field.component)) {
        ret[i] = dayjs(val)
      }

      ret[i] = val
    }

    for (let i in associations) {
      const association = associations[i]
      const val = data[i]

      if (isObject(val)) {
        ret[i] = val[association.primaryKeyAttribute]
      }

      if (Array.isArray(val)) {
        ret[i] = val.map(item => item[association.primaryKeyAttribute])
      }
    }

    return ret
  }

  handleSubmit(type) {
    this.setState({
      submitType: type
    })
    this.formRef.current.submit()
  }

  onFinish = async values => {
    const { actions, store, pk } = this.props
    const { submitType } = this.state

    this.setState({
      loading: true,
    })

    values.pk = pk

    const ret = await actions.editItem(this.formatValues(values))
    if (ret) {
      message.success('编辑成功')

      if (submitType === SUBMIT) {
        this.props.history.push(`/model/${store.model}`)
      }
    }

    this.setState({
      loading: false,
    })
  }

  render() {
    const { data } = this.state

    if (!data) {
      return null
    }

    return (
      <Form
        ref={this.formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={this.getInitialValues()}
        onFinish={this.onFinish}
      >
        {this.renderFields()}
        {this.renderAssociations()}
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button
            loading={this.state.loading}
            type="primary"
            onClick={this.handleSubmit.bind(this, SUBMIT)}
          >
            提交
          </Button>
          <Button
            loading={this.state.loading}
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={this.handleSubmit.bind(this, SUBMIT_AND_STAY)}
          >
            提交并继续编辑
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
