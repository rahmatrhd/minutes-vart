import React, { Component } from 'react';

import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Icon,
  Input,
  Layout,
  Row,
  Tag,
  Spin,
  Modal,
  Select,
  Checkbox,
  Progress
} from 'antd'
import { BrowserRouter, Link } from 'react-router-dom'
import firebase from './firebaseConfig'
import axios from 'axios'

import './dashboard.css'

const { Content, Sider } = Layout
const Panel = Collapse.Panel

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      newTask: '',
      photoURL: '',
      review: {
        visibleModal: false,
        item: {
          topic: {
            text: ''
          },
          todo: {},
          notes: {
            0: {
              data: {}
            }
          },
          report: {
            userParticipationRate: {
              0: {}
            },
            userContributionRate: {
              0: {}
            },
            userFocusness: {
              0: {}
            }
          }
        }
      },
      roomList: [],
      summaryList: '',
      todoList: {
        backlog: [],
        done: [],
        onProgress: [],
        todo: []
      },
      topicTitle: '',
      userId: '',
      username: '',
      users: {},
      visible: false
    }
  }
  
  addNewTaskChange(e) {
    this.setState({newTask: e.target.value})
  }

  addTaskModal(item) {
    this.setState({
      visible: true
    })
  }

  addHandleOk(e) {
    e.preventDefault()
    this.setState({
      visible: false
    })
    this.addNewTask()
  }

  addHandleCancel() {
    this.setState({
      visible: false
    })
  }

  reviewModal(item) {
    console.log(item)
    this.setState({
      review: {
        visibleModal: true,
        item
      }
    })
  }
  
  modalHandleOk() {
    console.log(this.state.review.item.todo)
    axios.post(`https://us-central1-minutes-vart.cloudfunctions.net/submitReview`, {
      historyId: this.state.review.item.key,
      todo: this.state.review.item.todo
    })
    .then(() => {
      this.setState({
        review: {
          ...this.state.review,
          visibleModal: false
        }
      })
    })
  }
  
  modalHandleCancel() {
    this.setState({
      review: {
        ...this.state.review,
        visibleModal: false
      }
    })
  }
  
  getAllUsers() {
    firebase.database().ref('users').once('value')
    .then(snapshot => {
      this.setState({
        users: snapshot.val()
      })
    })
  }

  createRoom(e) {
    e.preventDefault();
    axios.get(`https://us-central1-minutes-vart.cloudfunctions.net/watsonNLU?text=${this.state.topicTitle}`)
    .then(({ data }) => {
      console.log(data.error)
      if (data.error) {
        alert('Room\'s name should be descriptive and written in English' )
      } else {
        let ref = firebase.database().ref(`/rooms/`)
        let roomData = {
          status: true,
          topic: {
            categories: data.categories,
            text: this.state.topicTitle
          },
          timestamp: Date.now()
        }
        ref.push().set(roomData)
        this.setState({ topicTitle: '' })
      }
    })
  }

  getAllRooms() {
    let ref = firebase.database().ref('/rooms')
    ref.on('value', snapshot => {
      let temp = []
      let list = Object.entries(snapshot.val()) || {}
      list.map(li => {
        let participant = li[1].participant ? Object.entries(li[1].participant) : [['', {name: 'Kagak ada orangnya'}]]
        // let participant = li[1].participant ? Object.entries(li[1].participant) : []
        console.log(participant)
        let participants = []
        participant.map(ind => {
          participants.push(ind[1].name)
        })
        temp.push({
          participants: participants,
          roomId: li[0],
          topic: li[1].topic.text.toUpperCase() || undefined
        })
      })
      this.setState({ roomList: temp })
    })
  }

  getAllTodo() {
    let ref = firebase.database().ref('/kanban')
    ref.on('value', snapshot => {
      if (snapshot.val() !== null) {
        let list = Object.entries(snapshot.val())
        let todoList = {
          backlog: [],
          done: [],
          onProgress: [],
          todo: []
        }
        list.map(li => {
          if (li[1].status === 'done') {
            let done = li[1]
            done.taskId = li[0]
            todoList.done.push(done)
          } else if (li[1].status === 'onProgress') {
            let progress = li[1]
            progress.taskId = li[0]
            todoList.onProgress.push(progress)
          } else if (li[1].status === 'todo') {
            let todo = li[1]
            todo.taskId = li[0]
            todoList.todo.push(todo)
          } else if (li[1].status === 'backlog') {
            let backlog = li[1]
            backlog.taskId = li[0]
            todoList.backlog.push(backlog)
          }
        })
        this.setState({ todoList: todoList })
      }
    })
  }

  getAllSummary() {
    let sum = firebase.database().ref('/history')
    sum.on('value', snapshot => {
      if (snapshot.val() !== null) {
        let summary = []
        let listSummary = Object.entries(snapshot.val())
        listSummary.map(summ => {
          summ[1].key = summ[0]
          summary.push(summ[1])
        })
        this.setState({ summaryList: summary })
      }
    })
  }

  topicTitleChange(e) {
    this.setState({ topicTitle: e.target.value })
  }

  logout() {
    console.log('Logout')
    firebase.auth().signOut()
      .then(() => {
        console.log('signed out')
      })
  }

  // --------------------------- kanbans---------------------------

  addNewTask() {
    console.log('name', this.state.username)
    const key = firebase.database().ref(`/kanban`).push().key
    firebase.database().ref(`/kanban/${key}`).set({
      status: 'backlog',
      task: this.state.newTask,
      taskId: key,
      user: {
        name: this.state.username,
        userId: this.state.userId
      }
    })
    this.setState({newTask: ''})
  }

  deleteTask(task) {
    console.log('deleteTask')
    if (task.user.userId === this.state.userId) {
      firebase.database().ref(`/kanban/${task.taskId}`).remove()
    } else {
      alert('You are not authorized to edit this task')
    }
  }

  toBackLog(task) {
    console.log('toBackLog')
    if (task.user.userId === this.state.userId) {
      task.status = 'backlog'
      firebase.database().ref(`/kanban/${task.taskId}`).set(task)
    } else {
      alert ('You are not authorized to edit this task')
    }
  }

  toTodo(task) {
    console.log('toTodo')
    if (task.user.userId === this.state.userId) {
      task.status = 'todo'
      firebase.database().ref(`/kanban/${task.taskId}`).set(task)
    } else {
      alert ('You are not authorized to edit this task')
    }
  }

  toOnProgress(task) {
    console.log('toOnProgress')
    if (task.user.userId === this.state.userId) {
      task.status = 'onProgress'
      firebase.database().ref(`/kanban/${task.taskId}`).set(task)
    } else {
      alert('You are not authorized to edit this task')
    }
  }

  toDone(task) {
    console.log('toDone')
    if (task.user.userId === this.state.userId) {
      task.status = 'done'
      firebase.database().ref(`/kanban/${task.taskId}`).set(task)
    } else {
      alert('You are not authorized to edit this task')
    }
  }

  // --------------------------- kanbans---------------------------

  stateChangeListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)

        let ref = firebase.database().ref('/users')
        ref.once('value', snap => {
          let regist = snap.hasChild(user.uid)
          if (!regist) {
            console.log('Not Registered. Register first.')
            // this.logout()
            this.props.history.push('/')
          }
        })

        this.setState({
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          userId: user.uid
        })
      } else {
        this.props.history.push('/')
      }
    })
  }

  componentWillMount() {
    this.stateChangeListener()
    this.getAllTodo()
    this.getAllRooms()
    this.getAllSummary()
    this.getAllUsers()
  }

  paketJoin(roomId, topic) {
    console.log('kirim paket')
    let ref = firebase.database().ref(`/rooms/${roomId}/participant/${this.state.userId}`)
    ref.set({
      name: this.state.username,
      id: this.state.userId
    })
    // this.props.history.push(`/chatroom/${roomId}`)
    this.props.history.push({
      pathname: `/chatroom/${roomId}`,
      state: {topic: topic}
    })
  }

  judulHistory(title) {
    return `Topic : ${title.toUpperCase()}`
  }

  render() {
    return (
      <Layout>
        <Layout className='App'>
          <div className='kanban'>
            <div className='logo'>
              <div className='minutes'>
                <img id="minutes"
                  alt='logo'
                  src='logo.png'/>
              </div>
              <div className='name'>
                <h1>Project Name</h1>
                <hr /><br />
                <Button 
                  onClick={() => this.addTaskModal()}
                  icon="plus" 
                  size='large'>
                  NEW TASK
                </Button>


                <Modal
                  title="Add New Task"
                  visible={this.state.visible}
                  onOk={(e) => this.addHandleOk(e)}
                  onCancel={() => this.addHandleCancel()}
                  cancelText="Cancel"
                  okText="Ok"
                >
                  <Form onSubmit={(e) => this.addHandleOk(e)} >
                    <Input
                      onChange={(e) => this.addNewTaskChange(e)}
                      prefix={<Icon type="calendar" style={{ fontSize: 13 }} />} type="text" placeholder="New Task ..."
                      value={this.state.newTask}
                    />
                  </Form>
                </Modal>


              </div>
            </div>
            <div className='kanbancontent'>
              <div style={{
                padding: '20px'
              }}>
                <Row gutter={5}>
                  <Col span={6}>
                    <Card title="BACK LOG" bordered={false} style={{backgroundColor: 'rgba(255,0,0, 0.5)'}}>
                      {
                        this.state.todoList.backlog.map((back, idx) => {
                          return (
                            <div key={idx}>
                              <Card style={{}}>
                                <p style={{fontSize: '18px'}}>{back.task}</p>
                                <p>Assign to: {back.user.name}</p><br />
                                  <div className="singlebutton">
                                    <Button
                                      onClick={() => this.deleteTask(back)}
                                      type="danger"
                                      shape="circle"
                                      icon="delete">
                                    </Button>
                                    <Button
                                      onClick={() => this.toTodo(back)}
                                      type="dashed"
                                      shape="circle"
                                      icon="right-circle">
                                    </Button>
                                  </div>
                              </Card>
                              <br />
                            </div>
                          )
                        })
                      }
                    </Card>
                  </Col>


                  <Col span={6}>
                    <Card title="TO-DO" bordered={false} style={{backgroundColor: 'rgba(255,165,0, 0.5)'}}>
                      {
                        this.state.todoList.todo.map((td, idx) => {
                          return (
                            <div key={idx}>
                              <Card>
                                <p style={{fontSize: '18px'}}>{td.task}</p>
                                <p>Assign to: {td.user.name}</p><br />
                                <div className="wrapbutton">
                                <Button
                                onClick={() => this.toBackLog(td)}
                                type="dashed" shape="circle"
                                icon="left-circle">
                                </Button>
                                <Button
                                  onClick={() => this.deleteTask(td)}
                                  type="danger"
                                  shape="circle"
                                  icon="delete">
                                </Button>
                                <Button
                                onClick={() => this.toOnProgress(td)}
                                type="dashed" shape="circle"
                                icon="right-circle">
                                </Button>
                                </div>
                              </Card>
                              <br />
                            </div>
                          )
                        })
                      }
                    </Card>
                  </Col>

                  <Col span={6}>
                    <Card title="ON PROGRESS" bordered={false} style={{backgroundColor: 'rgba(0,0,255, 0.5)'}}>
                      {
                        this.state.todoList.onProgress.map((prog, idx) => {
                          return (
                            <div key={idx}>
                              <Card>
                                <p style={{fontSize: '18px'}}>{prog.task}</p>
                                <p>Assign to: {prog.user.name}</p><br />
                                <div className="wrapbutton">
                                <Button
                                  onClick={() => this.toTodo(prog)}
                                  type="dashed"
                                  shape="circle"
                                  icon="left-circle">
                                </Button>
                                <Button
                                  onClick={() => this.deleteTask(prog)}
                                  type="danger"
                                  shape="circle"
                                  icon="delete">
                                </Button>
                                <Button
                                  onClick={() => this.toDone(prog)}
                                  type="dashed"
                                  shape="circle"
                                  icon="right-circle">
                                </Button>
                                </div>
                              </Card>
                              <br />
                            </div>
                          )
                        })
                      }
                    </Card>
                  </Col>

                  <Col span={6}>
                    <Card title="DONE" bordered={false} style={{backgroundColor: 'rgba(0,128,0, 0.5)'}}>
                      {
                        this.state.todoList.done.map((dn, idx) => {
                          return (
                            <div key={idx}>
                              <Card>
                                <p style={{fontSize: '18px'}}>{dn.task}</p>
                                <p>Assign to: {dn.user.name}</p><br />
                                <div className="singlebutton">
                                  <Button
                                    onClick={() => this.toOnProgress(dn)}
                                    type="dashed"
                                    shape="circle"
                                    icon="left-circle">
                                  </Button>
                                  <Button
                                    onClick={() => this.deleteTask(dn)}
                                    type="danger"
                                    shape="circle"
                                    icon="delete">
                                  </Button>
                                </div>
                              </Card>
                              <br />
                            </div>
                          )
                        })
                      }
                    </Card>
                  </Col>

                </Row>
              </div>
            </div>
          </div>
          <div className='discussion'>
            <div className='info'>
              <div className='userinfo'>
                <Avatar size="large" src={this.state.photoURL} /><br />
                <b>
                  {this.state.username}
                </b>
              </div>
              <div className='logout'>
                <Button
                  type="primary"
                  onClick={this.logout}
                  style={{
                    background: '#13314D'
                  }}>Logout</Button>
              </div>
            </div>
            <div className='active'>
              <h1 style={{color: 'white'}}>Discussion List</h1>
              <Form onSubmit={(e) => this.createRoom(e)}>
                <Input
                  size='large'
                  value={this.state.topicTitle}
                  onChange={e => this.topicTitleChange(e)}
                  placeholder="Add Room Name..." style={{width: '70%', marginRight: 10}}/> 
                  <Button icon="plus" size='large' htmlType='submit'>Add Discussion</Button>
              </Form>
              <br />
              <br />
              {
                this.state.roomList.map((room, idx) => {
                  return (
                    <Card
                      key={idx}
                      title={room.topic}
                      extra={<a onClick={(e) => this.paketJoin(room.roomId, room.topic)}> Join </a>}
                      style={{
                        marginBottom: '10px',
                        marginRight: '10px',
                        background: '#2D587B'
                      }}>
                      {
                        room.participants.map((orang, i) => {
                          return (
                            <Tag key={i}>
                              {orang}
                            </Tag>
                          )
                        })
                      }
                    </Card>
                  )
                })
              }
            </div>
            <div className='history'>
              <h1 style={{color: 'white', marginLeft: 20}}>Discussion History List</h1>
              <Collapse bordered={false} className='collapse'>
                {this.state.summaryList ? this.state.summaryList.map(item => {
                  return (
                    <Panel
                      header={this.judulHistory(item.topic.text)}
                      key="1"
                      style={customPanelStyle}
                      key={item.key}
                    >
                      
                      <div>
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div>
                        {Object.keys(item.participant).map(key => <Tag>{item.participant[key].name}</Tag>)}
                      </div>
                      <div><br />
                        {!item.status ? <Button type="primary" onClick={() => this.reviewModal(item)}>Review</Button> : ''} 
                      </div>
                    </Panel>
                  )
                }) : <Spin size="large" />}
              </Collapse>
              <Modal
                title={this.state.review.item.topic.text}
                visible={this.state.review.visibleModal}
                onOk={() => this.modalHandleOk()}
                onCancel={() => this.modalHandleCancel()}
                okText="Submit"
                cancelText="Cancel"
              >
                Tasks
                {Object.keys(this.state.review.item.todo).map(key => {
                  const todo = this.state.review.item.todo[key]
                  return (
                    <Col>
                      <Row gutter={4}>
                        <Col span={23}>
                          <Input.Group compact>
                            <Select 
                              labelInValue
                              style={{ width: '30%' }}
                              defaultValue={{key: todo.userId}}
                              onChange={(e) => {
                                this.state.review.item.todo[key].userId = e.key
                                this.state.review.item.todo[key].userName = e.label
                                this.forceUpdate()
                              }}
                            >
                              {Object.keys(this.state.users).map(id => (
                                <Select.Option value={id} >{this.state.users[id].name}</Select.Option>
                              ))}
                            </Select>
                            <Input style={{ width: '70%' }} defaultValue={todo.task} />
                          </Input.Group>
                        </Col>
                        <Col span={1}>
                          <Checkbox 
                            checked={todo.status}
                            onChange={(e) => {
                              this.state.review.item.todo[key].status = e.target.checked
                              this.forceUpdate()
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  )
                })}
                <br/>
                
                Noted Chat
                <ul>
                  {Object.keys(this.state.review.item.notes).map(key => {
                    const note = this.state.review.item.notes[key]
                    return (
                      <li>{note.data.text}</li>
                    )
                  })}
                </ul>
                <br/>
                
                Duration: {this.state.review.item.report.duration}
                <br/>
                
                <Row>
                  <Col span={12}>
                    Discussion Efficiency
                    <Progress type="dashboard" percent={Math.floor(this.state.review.item.report.discussionEfficiency * 100)} />
                  </Col>
                  <Col span={12}>
                    Discussion Productivity
                    <Progress type="dashboard" percent={Math.floor(this.state.review.item.report.discussionProductivity * 100)} />
                  </Col>
                </Row>
                <br/>
                
                User Participation Rate
                {Object.keys(this.state.review.item.report.userParticipationRate).map(key => {
                  const user = this.state.review.item.report.userParticipationRate[key]
                  return (
                    <Row>
                      <Col span={4}>
                        {user.name}
                      </Col>
                      <Col span={20}>
                        <Progress percent={Math.floor(user.score * 100)} strokeWidth={5}/>
                      </Col>
                    </Row>
                  )
                })}
                <br/>
                
                User Contribution Rate
                {Object.keys(this.state.review.item.report.userContributionRate).map(key => {
                  const user = this.state.review.item.report.userContributionRate[key]
                  return (
                    <Row>
                      <Col span={4}>
                        {user.name}
                      </Col>
                      <Col span={20}>
                        <Progress percent={Math.floor(user.score * 100)} strokeWidth={5}/>
                      </Col>
                    </Row>
                  )
                })}
                <br/>
                
                User Focusness
                {Object.keys(this.state.review.item.report.userFocusness).map(key => {
                  const user = this.state.review.item.report.userFocusness[key]
                  return (
                    <Row>
                      <Col span={4}>
                        {user.name}
                      </Col>
                      <Col span={20}>
                        <Progress percent={Math.floor(user.score * 100)} strokeWidth={5}/>
                      </Col>
                    </Row>
                  )
                })}
              </Modal>
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