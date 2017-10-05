import React, {Component} from 'react';
import {Layout} from 'antd'

import './App.css'


const { Content, Sider } = Layout

class Dashboard extends Component {
  render() {
    return (
      <Layout>
        <Layout className= 'app'>
          <Content className = 'kanban'>main content</Content>
          <Sider className = 'discussion'>left sidebar</Sider>
        </Layout>
      </Layout>
    )
  }
}

export default Dashboard