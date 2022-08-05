import { Component } from 'react'
import { toJS } from 'mobx'
import {
  Form,
  Input,
  Switch,
  DatePicker,
  TimePicker,
  Select,
  InputNumber,
} from '@dx/xbee'
import Transfer from '@components/Transfer'

import './form.less'

export default class ItemForm extends Component {
  handleChange = (type, event) => {
    const target = event?.target
    const value = target ? target.value : event

    this.setState({
      [type]: value,
    })
  }

  getValuePropName(field) {
    const { component } = field

    if (component === 'switch') {
      return 'checked'
    }

    return 'value'
  }

  getComponent(field) {
    const { component, options } = field

    if (component === 'textarea') {
      return <Input.TextArea showCount rows={4} />
    }

    if (component === 'password') {
      return <Input.Password />
    }

    if (component === 'number') {
      return <InputNumber />
    }

    if (component === 'switch') {
      return <Switch />
    }

    if (component === 'select') {
      return (
        <Select>
          {options.map(item => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.name}
              </Select.Option>
            )
          })}
        </Select>
      )
    }

    // if (component === 'radio') {

    // }

    // if (component === 'checkbox') {

    // }


    if (component === 'date') {
      return <DatePicker />
    }

    if (component === 'dateTime') {
      return <DatePicker showTime />
    }

    if (component === 'time') {
      return <TimePicker />
    }

    if (component === 'transfer') {
      return (
        <Transfer
          titles={['来源', '已选']}
          dataSource={options.map(item => {
            return {
              key: item.value,
              title: item.name
            }
          })}
          render={item => item.title}
        />
      )
    }

    // if (component === 'editor') {

    // }

    return <Input />
  }

  renderFields() {
    const { store } = this.props
    const adminConfig = toJS(store.config.admin)
    const { fields, primaryKey } = adminConfig

    // 过滤自增id
    const keys = Object.keys(fields).filter(key => {
      if (key === primaryKey.fieldName && primaryKey.autoIncrement) {
        return false
      }

      return true
    })

    return keys.map(key => {
      const field = fields[key]
      const rules = []

      if (field.required) {
        rules.push({
          required: true,
          message: '请选择' + field.name,
        })
      }

      return (
        <Form.Item
          key={key}
          label={field.name || key}
          name={key}
          valuePropName={this.getValuePropName(field)}
          rules={rules}
        >
          { this.getComponent(field) }
        </Form.Item>
      )
    })
  }

  renderAssociations() {
    const { store } = this.props
    const adminConfig = toJS(store.config.admin)
    const { associations } = adminConfig
    const keys = Object.keys(associations)

    return keys.map(key => {
      const association = associations[key]

      return (
        <Form.Item
          key={key}
          label={association.name}
          name={key}
        >
          { this.getComponent(association) }
        </Form.Item>
      )
    })
  }
}
