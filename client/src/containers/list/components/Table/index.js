import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import dayjs from 'dayjs'
import { Table, Tooltip, Modal, Space, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import Base from '@components/BasePage/SearchTable/Table'
import { pick, substitute, isObject, formatBytes } from '@utils'
import './styles.less'

@inject('actions', 'store')
@observer
export default class PageTable extends Base {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      page: 1,
      pageSize: 10,
      itemCount: 0,
    }
  }

  fetchData = async (query = {}) => {
    const { store, actions } = this.props

    query = Object.assign(
      toJS(store.pageConditions),
      pick(['page', 'pageSize', 'orderField', 'orderDirection'], this.state),
      query,
    )

    actions.merge({
      loading: true,
    })
    const data = await actions.getList(query)
    actions.merge({
      loading: false,
    })

    if (data) {
      this.setState({
        itemCount: data.count,
        items: data.rows,
        page: query.page,
        pageSize: query.pageSize,
      })
    }
  }

  handleEdit(record) {
    const { model, primaryKeyAttribute } = this.props.store
    this.props.history.push(`/model/${model}/edit/${record[primaryKeyAttribute]}`)
  }

  handleDelete(record) {
    const { config } = this.props.store
    const adminConfig = toJS(config.admin)
    const title = `您确定要删除“${substitute(adminConfig.format, record)}”吗`

    Modal.confirm({
      title,
      onOk: () => {
        this.submitDelete(record)
      },
      // onCancel() {},
    })
  }

  submitDelete = async record => {
    const { actions, store } = this.props
    const { primaryKeyAttribute } = store
    const r = await actions.deleteItem({
      pk: record[primaryKeyAttribute],
    })

    if (r) {
      message.success('删除成功')
      actions.resetConditions('page')
    }
  }

  getColumns() {
    const { config } = this.props.store
    const adminConfig = toJS(config.admin)
    const { fields, associations, listFields, orderFields } = adminConfig

    const columns = listFields.map(item => {
      // 列表支持展示关联字段
      const association = associations[item]
      const field = fields[item]

      if (association) {
        return {
          title: association.name,
          dataIndex: item,
          render: v => {
            if (Array.isArray(v)) {
              return v
                .map(item => substitute(association.format, item))
                .join(',')
            }

            if (isObject(v)) {
              return substitute(association.format, v)
            }

            return ''
          },
        }
      }

      const { options, component } = field
      const format = field.format || {}

      return {
        title: field.name,
        dataIndex: item,
        sorter: orderFields.includes(item),
        render: (v, record) => {
          if (v == null || v === '') {
            return ''
          }

          // 根据component和format进行展示
          if (component === 'select' && options) {
            const find = options.find(i => i.value == v)
            return find !== undefined ? find.name : v
          }

          if (component === 'time') {
            return dayjs(v).format('HH:mm:ss')
          }

          if (component === 'date') {
            return dayjs(v).format('YYYY-MM-DD')
          }

          if (component === 'dateTime') {
            return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
          }

          if (component === 'switch') {
            return v ? '是' : '否'
          }

          if (format.type === 'image') {
            return <img src={v} style={{ maxWidth: 120 }} />
          }

          if (format.type === 'bytes') {
            return formatBytes(v)
          }

          if (format.type === 'link') {
            return (
              <a
                href={substitute(format.link, record) || v}
                rel="noopener noreferrer"
                target="_blank"
              >
                {substitute(format.text, record) || v}
              </a>
            )
          }

          if (format.type === 'tooltip') {
            return (
              <Tooltip title={v}>
                <a>{substitute(format.text, record) || '查看'}</a>
              </Tooltip>
            )
          }

          return v
        },
      }
    })

    columns.push({
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle" styleName="actions">
            <EditOutlined onClick={this.handleEdit.bind(this, record)} />
            <DeleteOutlined onClick={this.handleDelete.bind(this, record)} />
          </Space>
        )
      },
    })

    return columns
  }

  render() {
    const { loading, primaryKeyAttribute } = this.props.store

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={this.getColumns()}
          rowKey={record => record[primaryKeyAttribute]}
          dataSource={this.getDataSource()}
          pagination={this.getPagination()}
          onChange={this.handleTableChange}
        />
      </Fragment>
    )
  }
}
