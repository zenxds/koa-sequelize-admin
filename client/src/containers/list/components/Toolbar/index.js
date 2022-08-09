import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Form, Button, Input, Select, Row, Col } from 'antd'

import { unique } from '@utils'
import SearchableSelect from '@components/Select/SearchableSelect'
import Base from '@components/BasePage/SearchTable/FormToolbar'

import './styles.less'

@inject('actions', 'store')
@observer
export default class PageToolbar extends Base {
  handleCreate = () => {
    const { model } = this.props.store

    this.props.history.push(`/model/${model}/add`)
  }

  render() {
    const { store } = this.props
    const config = toJS(store.config)
    const { admin: adminConfig } = config
    const { fields, searchFields, filterFields, associations } = adminConfig
    const fieldsToRender = unique(filterFields.concat(searchFields))

    if (!fieldsToRender.length) {
      return null
    }

    return (
      <Fragment>
        <Form
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Row gutter={20}>
            {fieldsToRender.map(item => {
              const options = store.getFieldOptions(item)
              const field = fields[item] || associations[item]

              if (options.length) {
                return (
                  <Col key={item} span={8}>
                    <Form.Item label={field.name} name={item}>
                      <SearchableSelect
                        placeholder="请选择"
                      >
                        {options.map(item => {
                          return (
                            <Select.Option key={item.value} value={item.value}>
                              {item.name}
                            </Select.Option>
                          )
                        })}
                      </SearchableSelect>
                    </Form.Item>
                  </Col>
                )
              }

              return (
                <Col key={item} span={8}>
                  <Form.Item label={field.name} name={item}>
                    <Input
                      onChange={this.handleChange.bind(this, item)}
                      onPressEnter={this.handleSearch}
                      allowClear
                      placeholder={'请输入' + field.name}
                    />
                  </Form.Item>
                </Col>
              )
            })}
          </Row>
        </Form>

        <div styleName="actions">
          <Button
            type="primary"
            onClick={this.handleSearch}
            loading={store.loading}
          >
            查询
          </Button>
          <Button onClick={this.handleReset}>重置</Button>
          <Button type="primary" onClick={this.handleCreate}>
            新增
          </Button>
        </div>
      </Fragment>
    )
  }
}
