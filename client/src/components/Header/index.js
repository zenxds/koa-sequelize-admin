import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
// import { DownOutlined } from '@ant-design/icons'

import paths from '@constants/paths'
import './less/styles.less'

@inject('userStore', 'userActions')
@observer
class Header extends Component {
  handleLogout = () => {
    location.href = paths.logout
  }

  render() {
    const { userStore } = this.props

    return (
      <Fragment>
        <div styleName="header-info">
          <div styleName="user-info">
            <a title={userStore.username}>
              {userStore.username}
            </a>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Header
