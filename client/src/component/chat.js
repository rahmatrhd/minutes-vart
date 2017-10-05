import React, { Component } from 'react'
import { Button, Form, Input } from 'antd'

import firebase from './firebaseConfig'

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      chatText: '',
      currentUser: '',
      email: '',
      messages: [],
      photoURL: '',
      userId: ''
    }
  }

  chatChange(e) {
    this.setState({
      chatText: e.target.value
    })
  }

  fetchAllMessages() {
    let ref = firebase.database().ref('/chat')
    ref.on('value', snapshot => {
      // let messages = snapshot.val()
      let messages = Object.entries(snapshot.val())
      this.setState({
        messages: messages
      })
    })
  }

  sendChat(e) {
    e.preventDefault()
    let ref = firebase.database().ref('/chat')
    ref.push().set({
      id: this.state.userId,
      message: this.state.chatText,
      senderName: this.state.currentUser
    })
    this.setState({ chatText: '' })
  }

  stateChangeListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          userId: user.uid
        })
      } else {
        this.props.history.push('/')
      }
    })
  }

  componentDidMount() {
    this.stateChangeListener()
    this.fetchAllMessages()
  }

  render() {
    return (
      <div>
        <Form onSubmit={(e) => this.sendChat(e)}>
          <Input
            placeholder='chat text'
            value={this.state.chatText}
            onChange={(e) => this.chatChange(e)}
          />
          <Button htmlType='submit'>
            Send
          </Button>
        </Form>
        <div>
          <ul>
            {
              this.state.messages.map(msg => {
                return (
                  <li>{msg[1].senderName} -- {msg[1].message}</li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}


export default Chat