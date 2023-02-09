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
  Transfer
} from 'antd'

import SearchableSelect from '@components/Select/SearchableSelect'
import Editor from '@components/Editor'
import TextAreaCount from '@components/TextAreaCount'

import './form.less'

export default class ItemForm extends Component {
  handleChange = (type, event) => {
    const target = event?.target
    const value = target ? target.value : event

    this.setState({
      [type]: value,
    })
  }

  // checkbox/radio/switch checked
  // transfer targetKeys
  getValuePropName(field) {
    const { component } = field

    if (component === 'switch') {
      return 'checked'
    }

    if (component === 'transfer') {
      return 'targetKeys'
    }

    return 'value'
  }

  formatValues(values) {
    const { store } = this.props
    const adminConfig = toJS(store.config.admin)
    const { fields } = adminConfig

    const ret = {}

    for (let key in values) {
      const value = values[key]
      const field = fields[key] || {}
      const component = field

      if (component === 'date') {
        ret[key] = value.utc().format('YYYY-MM-DD')
        continue
      }

      if (component === 'dateTime') {
        ret[key] = value.utc().format()
        continue
      }

      if (component === 'time') {
        ret[key] = value.utc().format('HH:mm:ss')
        continue
      }


      ret[key] = value
    }

    return ret
  }

  getComponent(field) {
    const { store, pk } = this.props
    const { component } = field
    const options = store.getFieldOptions(field.fieldName)
    const props = {}

    if (pk) {
      props.disabled = field.editable === undefined ? false : !field.editable
    }

    if (component === 'textarea') {
      return <TextAreaCount {...props} rows={4} />
    }

    if (component === 'password') {
      return <Input.Password {...props} />
    }

    if (component === 'number') {
      return <InputNumber {...props} />
    }

    if (component === 'switch') {
      return <Switch {...props} />
    }

    if (component === 'select') {
      return (
        <SearchableSelect {...props}>
          {options.map(item => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.name}
              </Select.Option>
            )
          })}
        </SearchableSelect>
      )
    }

    // if (component === 'radio') {

    // }

    // if (component === 'checkbox') {

    // }


    if (component === 'date') {
      return <DatePicker {...props} />
    }

    if (component === 'dateTime') {
      return <DatePicker {...props} showTime />
    }

    if (component === 'time') {
      return <TimePicker {...props} />
    }

    if (component === 'transfer') {
      return (
        <Transfer
          {...props}
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

    if (component === 'editor') {
      return (
        <Editor />
      )
    }

    return <Input {...props} />
  }

  renderFields() {
    const { store } = this.props
    const config = toJS(store.config)
    const adminConfig = config.admin
    const { fields, primaryKeyAttribute, primaryKeyAutoIncrement } = adminConfig

    // 过滤自增id、自动生成字段、虚拟字段
    const keys = Object.keys(fields).filter(key => {
      if (key === primaryKeyAttribute && primaryKeyAutoIncrement) {
        return false
      }

      if (fields[key].isAutoGenerated || fields[key].isVirtual) {
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
          message: `${field.name} is required`,
        })
      }

      return (
        <Form.Item
          key={key}
          label={field.name || key}
          name={key}
          extra={field.tip}
          hasFeedback={field.component === 'input'}
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
    const keys = Object.keys(associations).filter(key => {
      return associations[key].visible !== false
    })

    return keys.map(key => {
      const association = associations[key]

      return (
        <Form.Item
          key={key}
          label={association.name}
          name={key}
          valuePropName={this.getValuePropName(association)}
        >
          { this.getComponent(association) }
        </Form.Item>
      )
    })
  }
}
