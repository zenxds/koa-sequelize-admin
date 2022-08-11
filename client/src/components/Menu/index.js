import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Menu } from 'antd'

import './less/styles.less'

const { Item, SubMenu } = Menu

@inject('menuActions')
@withRouter
@observer
class PageMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menus: [],
    }
  }

  async componentDidMount() {
    const menus = await this.props.menuActions.getMenus()
    if (menus) {
      this.setState({
        menus,
      })
    }
  }

  handleClick = e => {
    const { location, history } = this.props
    const pathname = location.pathname
    const target = e.item.props.pathname

    if (pathname !== target) {
      history.push(target)
    }
  }

  render() {
    const { menus } = this.state
    const { location } = this.props
    const pathname = location.pathname

    if (!menus.length) {
      return null
    }

    return (
      <Fragment>
        <Link to="/" styleName="logo">
          <img src={`${__webpack_public_path__}images/logo.png`} />
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={[pathname.split('/').pop()]}
          onClick={this.handleClick}
        >
          {menus.map(item => {
            if (item.children) {
              return (
                <SubMenu key={item.name} title={item.name}>
                  {item.children.map(child => {
                    return (
                      <Item key={child.key} pathname={`/model/${child.key}`}>
                        {child.name}管理
                      </Item>
                    )
                  })}
                </SubMenu>
              )
            }

            return (
              <Item key={item.key} pathname={`/model/${item.key}`}>
                {item.name}管理
              </Item>
            )
          })}
        </Menu>
      </Fragment>
    )
  }
}

export default PageMenu
