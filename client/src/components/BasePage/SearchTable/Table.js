import { Component } from 'react'
import { reaction } from 'mobx'

export default class PageTable extends Component {
  componentDidMount() {
    this.initReaction()
  }

  componentWillUnmount() {
    this.disposer()
  }

  initReaction() {
    const { store } = this.props

    // fetchId变化时重新请求数据
    this.disposer = reaction(
      () => {
        return store.pageFetchId
      },
      () => {
        this.fetchData({
          page: 1,
        })
      },
      {
        fireImmediately: true,
      },
    )
  }

  // handlePageChange = async (page, pageSize) => {
  //   return this.fetchData({ page, pageSize })
  // }

  handleTableChange = (pagination, filters, sorter) => {
    const orderDirectionMap = {
      ascend: 'ASC',
      descend: 'DESC'
    }
    const query = {
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    const order = sorter.order ? {
      orderField: sorter.field,
      orderDirection: orderDirectionMap[sorter.order]
    } : {
      orderField: '',
      orderDirection: ''
    }

    this.setState(order)
    this.fetchData(Object.assign(query, order))
  }

  getDataSource() {
    const { items } = this.state
    return items.slice()
  }

  getPagination() {
    const { page, pageSize, itemCount } = this.state

    return {
      size: 'small',
      current: page,
      total: itemCount,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      // onChange: this.handlePageChange,
      // onShowSizeChange: this.handlePageChange,
    }
  }
}
