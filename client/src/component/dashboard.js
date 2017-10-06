import React, {Component} from 'react';
import {Layout, Collapse, Card, Avatar, Button} from 'antd'
import { BrowserRouter, Link } from 'react-router-dom'

import firebase from './firebaseConfig'

import './dashboard.css'

const {Content, Sider} = Layout
const Panel = Collapse.Panel

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      photoURL: '',
      roomList: []
    }
  }

  getAllRooms() {
    let ref = firebase.database().ref('/rooms')
    ref.on('value', snapshot => {
      // console.log(snapshot.val())
      let temp = []
      let list = Object.entries(snapshot.val())
      console.log('list>>>', list);
      list.map(li => {
        temp.push({
          roomId: li[0],
          topic: li[1].topic.text || undefined
        })
      })
      this.setState({ roomList: temp })
    })
  }

  logout() {
    console.log('Logout')
    firebase.auth().signOut()
    .then(() => {
      console.log('signed out')
    })
  }

  stateChangeListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.setState({
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
      } else {
        this.props.history.push('/')
      }
    })
  }

  componentDidMount() {
    this.stateChangeListener()
    this.getAllRooms()
  }

  render() {
    return (
      <Layout>
        <Layout className='App'>
          <div className='kanban'>
            <div className='logo'>
              <div className='minutes'>
                <img
                  alt='logo'
                  src='https://www.freelogoservices.com/api/main/images/1j+ojVVCOMkX9Wyrexe4hGfU16jF6EIMjkLP2ig3M2RE9gxvkSYrhfNi47hlc1xFtFwKhhQIc8E6iyd9'/>
              </div>
              <div className='name'>
                <h1>Project Name</h1>
              </div>
            </div>
            <div className='kanbancontent'>
              DISINI ISI KANBAN
            </div>
          </div>
          <div className='discussion'>
            <div className='info'>
              <div className='userinfo'>
                <Avatar size="large" src={this.state.photoURL}/><br/>
                <b>
                  { this.state.username }
                </b>
              </div>
              <div className='logout'>
                <Button type="primary" onClick={ this.logout } style={{background: '#13314D'}}>Logout</Button>
              </div>
            </div>
            <div className='active'>
              {
                this.state.roomList.map(room => {
                  return (
                    <Card
                      title={ room.topic }
                      extra={<Link to={{
                        pathname: `/chatroom/${room.roomId}`
                      }} >
                        Join
                      </Link>}
                      style={{
                        marginBottom: '10px',
                        background: '#13314D'
                      }} bordered={false}>
                      <p style={{ color: 'white' }}>Discussion topic</p>
                    </Card>
                  )
                })
              }
            </div>
            <div className='history'>
              <Collapse bordered={false} className='collapse'>
                <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
                  <p>blah</p>
                </Panel>
                <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
                  <p>blah</p>
                </Panel>
                <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
                  <p>blah</p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </Layout>
      </Layout>
    )
  }
}

const customPanelStyle = {
  background: 'white',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};

export default Dashboard