import React, { Component } from 'react'
import store from './store'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'

import enUS from 'antd/lib/locale-provider/en_US'

import ChatRoom from './component/chatRoom'
import Dashboard from './component/dashboard'
import Login from './component/login'

import './App.css'

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Provider store={store}>
          <Router>
            <div className= 'app'>
              <Route exact path='/' component={Login} />
              <Route exact path='/chatroom/:id' component={ChatRoom} />
              <Route exact path='/dashboard' component={Dashboard} />
            </div>
          </Router>
        </Provider>
      </LocaleProvider>
    )
  }
}

export default App;
