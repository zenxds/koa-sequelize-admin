import { Component } from 'react'
import {
  // inject,
  observer,
} from 'mobx-react'
import {
  Switch,
  Route,
  // Redirect,
  withRouter,
} from 'react-router-dom'
import loadable from '@loadable/component'
import { Spin, Result } from '@dx/xbee'

import paths from '@constants/paths'
import Header from '@components/Header'
import Menu from '@components/Menu'

function load(page) {
  return loadable(() => import(`./${page}`), {
    fallback: (
      <div className="page-loading">
        <Spin />
      </div>
    ),
  })
}

@withRouter
@observer
export default class Main extends Component {
  render() {
    return (
      <div className="app-root">
        <div className="app-menu">
          <Menu />
        </div>
        <div className="app-wrapper">
          <div className="app-header">
            <Header />
          </div>
          <div className="app-content">
            <Switch>
              <Route exact path={paths.index} component={load('home')} />
              <Route exact path={paths.list} component={load('list')} />
              <Route exact path={paths.add} component={load('edit')} />
              <Route exact path={paths.edit} component={load('edit')} />
              <Route path="/">
                <Result status="404" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}