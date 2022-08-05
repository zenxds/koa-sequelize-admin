import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Form, Button, Input, Select, Row, Col } from '@dx/xbee'

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
    const conditions = toJS(store.pageConditions)
    const adminConfig = toJS(store.config.admin)
    const { fields, searchFields, associations } = adminConfig
    const filterFields = adminConfig.filterFields.filter(item => {
      return associations[item] && associations[item].options?.length > 0
    })

    return (
      <Fragment>
        <Form
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={conditions}
        >
          <Row gutter={20}>
            {filterFields.map(item => {
              const association = associations[item]
              return (
                <Col key={item} span={8}>
                  <Form.Item label={association.name} name={item}>
                    <Select placeholder="请选择" allowClear>
                      {association.options.map(item => {
                        return (
                          <Select.Option key={item.value} value={item.value}>
                            {item.name}
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              )
            })}

            {searchFields.map(item => {
              const field = fields[item]

              return (
                <Col key={item} span={8}>
                  <Form.Item label={field.name} name={item}>
                    <Input
                      onChange={this.handleChange.bind(this, item)}
                      onPressEnter={this.handleSearch}
                      allowClear
                      value={conditions[item]}
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
