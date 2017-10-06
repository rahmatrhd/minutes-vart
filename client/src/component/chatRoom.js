import React, {Component} from 'react';
import {
  Input,
  Button,
  Form,
  Timeline,
  Card,
  Icon,
  Table
} from 'antd'
import {ChatFeed, Message} from 'react-chat-ui'
import {BrowserRouter, Link} from 'react-router-dom'
import firebase from './firebaseConfig'
import axios from 'axios'

import Bubble from './chattext'
import './chatroom.css'

const FormItem = Form.Item;
const {Column, ColumnGroup} = Table;

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
      photoURL: '',
      userId: '',
      chatFeedElem: null
    }
  }

  chatChange(e) {
    this.setState({chatText: e.target.value})
  }

  fetchAllMessages() {
    let ref = firebase
      .database()
      .ref(`/rooms/${this.props.match.params.id}/chat`)
    ref.on('value', snapshot => {
      // console.log('snapshot>>> ', snapshot.val());

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
        this.setState({messages: temp})
      }

    })
  }

  sendChat(e) {
        let ref = firebase
      .database()
      .ref(`/rooms/${this.props.match.params.id}/chat`)
    ref
      .push()
      .set({id: this.state.userId, message: this.state.chatText, senderName: this.state.currentUser})
    this.setState({chatText: ''})
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
        'Content-Type' : 'application/json'
      }
    })
    .then(data => {
      this.setState({chatText: ''})
    })
    this.setState({chatText: ''})
  }

  stateChangeListener() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.setState({currentUser: user.displayName, email: user.email, photoURL: user.photoURL, userId: user.uid})
        } else {
          this
            .props
            .history
            .push('/')
        }
      })
  }

  componentDidMount() {
    this.stateChangeListener()
    this.fetchAllMessages()
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    // console.log('====================================');
    // console.log(elem.scrollHeight); console.log(elem.clientHeight);
    // console.log('===================================='); const scrollHeight =
    // elem.scrollHeight; const height = elem.clientHeight; const maxScrollTop =
    // scrollHeight - height; elem.scrollTop = maxScrollTop > 0   ? maxScrollTop   :
    // 0;
    // const node = ReactDOM.findDOMNode(this.messagesEnd);
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
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
                }}/>
              </Link>
            </div>
            <div className='middletask'>
              <h1 style={{
                color: 'white'
              }}>MY TASK</h1>
              <br/>
              <Timeline style={{
                color: 'white'
              }}>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">
                  <p>Solve initial network problems 3 2015-09-01</p>
                </Timeline.Item>
                <Timeline.Item>
                  <p>Technical testing 3 2015-09-01</p>
                </Timeline.Item>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
              </Timeline>
            </div>
          </div>
          <div className='member'>

            <Card
              style={{
              margin: 15,
              background: '#2D587B'
            }}
              noHovering
              bordered={false}>
              <Icon
                type="check-circle"
                style={{
                color: 'green',
                fontSize: 25,
                float: 'left'
              }}/>
              <h2
                style={{
                float: 'right',
                color: 'white'
              }}>Username</h2>
            </Card>
            <Card
              style={{
              margin: 15,
              background: '#2D587B'
            }}
              noHovering
              bordered={false}>
              <Icon
                type="check-circle"
                style={{
                color: 'green',
                fontSize: 25,
                float: 'left'
              }}/>
              <h2
                style={{
                float: 'right',
                color: 'white'
              }}>Username</h2>
            </Card>
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
            }}/>
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
              }}/>
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
            <br/>
            <Table
              dataSource={data}
              pagination={false}
              style={{
              background: '#9CB1BF',
              width: '23vw'
            }}>
              <Column title="Task" dataIndex="task" key="task"/>
              <Column title="User" dataIndex="user" key="user"/>
            </Table>
          </div>
          <div className='end'>
            <Button
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