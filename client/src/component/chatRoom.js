import React, { Component } from 'react';
import {
  Input,
  Button,
  Form,
  Timeline,
  Card,
  Icon,
  Table
} from 'antd'
import { ChatFeed, Message } from 'react-chat-ui'
import { BrowserRouter, Link } from 'react-router-dom'
import firebase from './firebaseConfig'
import axios from 'axios'

import Bubble from './chattext'
import './chatroom.css'

const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;

const data = [
  {
    key: '1',
    task: 'Wireframing',
    user: 'Brown'
  }, {
    key: '2',
    task: 'Layouting',
    user: 'Green'
  }, {
    key: '3',
    task: 'Create Server',
    user: 'Black'
  }
];

class ChatRoom extends Component {
  constructor() {
    super()
    this.state = {
      chatText: '',
      currentUser: '',
      email: '',
      messages: [],
      participants: [],
      photoURL: '',
      roomTask: [],
      roomStatus: true,
      userId: '',
      usersTodoList: {
        backlog: [],
        done: [],
        onProgress: [],
        todo: []
      }
    }
  }

  chatChange(e) {
    this.setState({ chatText: e.target.value })
  }

  deleteMinnieTask(taskId) {
    console.log('Delete minnie task');
    firebase.database().ref(`/rooms/${this.props.match.params.id}/minnie/todo/${taskId}`).remove()
  }

  fetchAllMessages() {
    let ref = firebase.database().ref(`/rooms/${this.props.match.params.id}/chat`)
    ref.on('value', snapshot => {
      if (snapshot.val() !== null) {
        let temp = []
        let messages = Object.entries(snapshot.val())
        messages.map(msg => {
          if (msg[1].id === this.state.userId) {
            msg[1].id = 0
          }
          msg[1].key = msg[0]
          temp.push(msg[1])
        })
        this.setState({ messages: temp })
      }
    })
  }

  fetchAllTask() {
    let ref = firebase.database().ref(`/rooms/${this.props.match.params.id}/minnie/todo`)
    ref.on('value', snapshot => {
      if (snapshot.val() !== null) {
        let tmp = []
        let todo = Object.entries(snapshot.val())
        todo.map(maps => {
          maps[1].key = maps[0]
          tmp.push(maps[1])
        })
        this.setState({ roomTask: tmp })
      }
    })
  }

  fetchAllTodo() {
    let ref = firebase.database().ref('/kanban')
    ref.on('value', snapshot => {
      if (snapshot.val() !== null) {
        let list = Object.entries(snapshot.val())
        let usersTodoList = {
          backlog: [],
          done: [],
          onProgress: [],
          todo: []
        }
        list.map(li => {
          if (li[1].status === 'done' && li[1].user.userId === this.state.userId) {
            let done = li[1]
            done.taskId = li[0]
            usersTodoList.done.push(done)
          } else if (li[1].status === 'onProgress' && li[1].user.userId === this.state.userId) {
            let progress = li[1]
            progress.taskId = li[0]
            usersTodoList.onProgress.push(progress)
          } else if (li[1].status === 'todo' && li[1].user.userId === this.state.userId) {
            let todo = li[1]
            todo.taskId = li[0]
            usersTodoList.todo.push(todo)
          } else if (li[1].status === 'backlog' && li[1].user.userId === this.state.userId) {
            let backlog = li[1]
            backlog.taskId = li[0]
            usersTodoList.backlog.push(backlog)
          }
        })
        this.setState({ usersTodoList: usersTodoList })
      }
    })
  }

  getParticipantList() {
    let ref = firebase.database().ref(`/rooms/${this.props.match.params.id}/participant`)
    ref.on('value', snapshot => {
      let longList = Object.entries(snapshot.val())
      let temp = []
      longList.map(list => {
        temp.push(list[1])
      })
      this.setState({participants: temp.sort()})
    })
  }

  roomStatusChecker() {
    firebase.database().ref(`/rooms/${this.props.match.params.id}/status`).on('value', snap => {
      this.setState({ roomStatus: snap.val() })
      // if (!snap.val()) {
      if (!this.state.roomStatus) {
        this.props.history.push('/dashboard')
      }
    })
  }

  sendChat(e) {
    let ref = firebase.database().ref(`/rooms/${this.props.match.params.id}/chat`)
    ref.push().set({ id: this.state.userId, message: this.state.chatText, senderName: this.state.currentUser })
    this.setState({ chatText: '' })
    e.preventDefault()
    axios.post('https://us-central1-minutes-vart.cloudfunctions.net/incomingChat', {
      roomId: this.props.match.params.id,
      chat: {
        user: {
          id: this.state.userId,
          name: this.state.currentUser
        },
        type: 'text',
        data: {
          text: this.state.chatText
        }
      }
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(data => {
        this.setState({ chatText: '' })
      })
    this.setState({ chatText: '' })
  }

  stateChangeListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUser: user.displayName, email: user.email, photoURL: user.photoURL, userId: user.uid })
      } else {
        this.props.history.push('/')
      }
    })
  }

  componentWillMount = async () => {
    await this.stateChangeListener()
    await this.roomStatusChecker()
    await this.fetchAllMessages()
    await this.fetchAllTodo()
    await this.getParticipantList()
    await this.fetchAllTask()
    await this.scrollToBottom()
  }
  
  scrollToBottom() {
    if (this.state.roomStatus) this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  endDiscussion() {
    const roomId = this.props.match.params.id
    axios.get(`https://us-central1-minutes-vart.cloudfunctions.net/closeDiscussion?room_id=${roomId}`)
  }

  render() {
    return (
      <div className='wrapper'>
        <div className='task'>
          <div className='innertask'>
            <div className='toptask'>
              <Link to='/dashboard'>
                <Button
                  shape="circle"
                  icon="arrow-left"
                  size='large'
                  style={{
                    margin: 15
                  }} />
              </Link>
            </div>
            <div className='middletask'>
              <h1 style={{
                color: 'white'
              }}>MY TASK</h1>
              <br />
              <Timeline style={{ color: 'white' }}>
                {
                  this.state.usersTodoList.backlog.map((list, idx) => {
                    return (
                      <Timeline.Item
                        key={idx}
                        color='green'>
                        {list.task}
                      </Timeline.Item>
                    )
                  })
                }
                {
                  this.state.usersTodoList.todo.map((list, idx) => {
                    return (
                      <Timeline.Item
                        key={idx}
                        color='green'>
                        {list.task}
                      </Timeline.Item>
                    )
                  })
                }
                {
                  this.state.usersTodoList.onProgress.map((list, idx) => {
                    return (
                      <Timeline.Item
                        key={idx}
                        color='red'>
                        {list.task}
                      </Timeline.Item>
                    )
                  })
                }
                {
                  this.state.usersTodoList.done.map((list, idx) => {
                    return (
                      <Timeline.Item
                        key={idx}
                        color='blue'>
                        {list.task}
                      </Timeline.Item>
                    )
                  })
                }
              </Timeline>
            </div>
          </div>
          <div className='member'>
            {
              this.state.participants.map((member, idx) => {
                return (
                  <Card key={idx}
                  style={{ margin: 15, background: '#2D587B' }}
                  noHovering
                  bordered={false}>
                    <Icon
                      type="check-circle"
                      style={{ color: 'green', fontSize: 25, float: 'left'
                      }} />
                    <h2 style={{ float: 'right', color: 'white' }}>
                      {member.name}
                    </h2>
                  </Card>
                )
              })
            }
          </div>
        </div>
        <div className='chatbox'>
          <div
            className='chattext'
            style={{
              marginLeft: 15,
              marginRight: 15
            }}>
            <ChatFeed ref={(elem) => {
              this.chatFeedElem = elem
            }} messages={this.state.messages} // Boolean: list of message objects
              isTyping={false} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName // show the name of the user who sent the message
              bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
              // JSON: Custom bubble styles
              bubbleStyles={{
                text: {
                  fontSize: 12
                },
                chatbubble: {
                  borderRadius: 10,
                  padding: 10,
                  maxWidth: 500
                }
              }} />
            <div
              style={{
                float: "left",
                clear: "both"
              }}
              ref={(el) => {
                this.messagesEnd = el;
              }}></div>
          </div>
          <div className='chatinput'>
            <Form onSubmit={(e) => this.sendChat(e)}>
              <Input
                size='large'
                placeholder='chat box..'
                value={this.state.chatText}
                onChange={(e) => this.chatChange(e)}
                style={{
                  width: '82%',
                  marginRight: '1%'
                }} />
              <Button
                ghost
                htmlType='submit'
                style={{
                  width: '10%',
                  overflow: 'hidden'
                }}>Send</Button>
            </Form>
          </div>
        </div>
        <div className='minnie'>
          <div className='content'>
            <h1
              style={{
                color: 'white',
                marginTop: 15
              }}>MINNIE The Minutes Bot</h1>
            <br />
            <Table
              dataSource={this.state.roomTask}
              pagination={false}
              style={{
                background: '#9CB1BF',
                width: '23vw'
              }}>
              <Column title="Task" dataIndex="task" key="task" />
              <Column title="User" dataIndex="userName" key="userName" />
              <Column
                title=""
                key="action"
                render={(text, rec) => (
                  <span>
                    <Button 
                      type="danger"
                      size="small"
                      onClick={() => this.deleteMinnieTask(rec.key)}
                    >
                      <span><Icon type="delete" /></span>
                    </Button>
                  </span>
                )}
              />
            </Table>
          </div>
          <div className='end'>
            <Button
              onClick={() => this.endDiscussion()}
              type="danger"
              size='large'
              style={{
                width: '20vw',
                overflow: 'hidden'
              }}>End Discussion</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatRoom