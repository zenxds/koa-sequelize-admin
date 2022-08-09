import { Component } from 'react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Main from './containers/main'
import './less/theme.less'
import './less/app.less'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/"
            render={props => <Main {...props} />}
          />
        </Switch>
      </Router>
    )
  }
}

export default App
