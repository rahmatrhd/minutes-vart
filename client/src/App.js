import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
// import store from './store'
import {Provider} from 'react-redux'

import Chat from './component/chat'
import ChatRoom from './component/chatRoom'
import Dashboard from './component/dashboard'
import Login from './component/login'
import './App.css'

class App extends Component {
  render() {
    return (
      // <Provider store={store}>
      <Provider>
        <Router>
          <div className= 'app'>
            <Route exact path='/' component={Login} />
            <Route exact path='/chat' component={Chat} />
            <Route exact path='/chatroom/:id' component={ChatRoom} />
            <Route exact path='/dashboard' component={Dashboard} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
