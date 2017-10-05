import React, {Component} from 'react';
import {Layout} from 'antd'

import './App.css'

const {Content, Sider} = Layout

class Dashboard extends Component {
  render() {
    return (
      <Layout>
        <Layout className='App'>
          <div className='kanban'>
            <div className='logo'>
              <img alt='logo' src='https://www.freelogoservices.com/api/main/images/1j+ojVVCOMkX9Wyrexe4hGfU16jF6EIMjkLP2ig3M2RE9gxvkSYrhfNi47hlc1xFtFwKhhQIc8E6iyd9'/>
            </div>
            <div className='content'>
              DISINI ISI KANBAN
            </div>
          </div>
          <div className='discussion'>
            
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default Dashboard