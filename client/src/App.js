import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import store from './store'
import {Provider} from 'react-redux'

import Dashboard from './component/dashboard'
import './App.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className= 'app'>
            <Route excat path='/dashboard' component={Dashboard} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
