import React, { Component } from 'react'
import { Select } from 'antd'

class SearchableSelect extends Component {
  render() {
    return (
      <Select
        allowClear
        showSearch
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
        }
        {...this.props}
      />
    )
  }
}

export default SearchableSelect
