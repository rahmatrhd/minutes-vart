import React, {Component} from 'react';
import {Input, Button, Form, Timeline} from 'antd'
import {ChatFeed, Message} from 'react-chat-ui'

import Bubble from './chattext'
import './chatroom.css'

const FormItem = Form.Item;

class ChatRoom extends Component {
  constructor() {
    super()
    this.state = {
      messages: [
        {
          id: 0,
          message: 'Id 0 untuk self bubble',
          senderName: 'You'
        }, {
          id: 2,
          message: 'id selain 0 untuk another user',
          senderName: 'Tama'
        }, {
          id: 0,
          message: 'id yang sama bersebelahan menjadi 1',
          senderName: 'Mark'
        }, {
          id: 0,
          message: 'seperti ini',
          senderName: 'Mark'
        }, {
          id: 1,
          message: 'Hi, My Name is Mark',
          senderName: 'Mark'
        }, {
          id: 2,
          message: 'shut up mark',
          senderName: 'Tama'
        }, {
          id: 0,
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum odio tellus," +
              " venenatis in ligula vitae, finibus aliquam leo. Nullam varius neque a lacus con" +
              "dimentum, sed scelerisque ipsum eleifend. Vestibulum imperdiet ex sit amet turpi" +
              "s vestibulum, quis porta justo varius. Integer ac bibendum erat. Pellentesque ut" +
              " nisi et nisi mattis finibus a et sapien. Etiam neque turpis, consequat eu dolor" +
              " eu, tempor maximus felis. Ut elementum dui at congue semper. Nullam scelerisque" +
              " commodo turpis, ac tincidunt massa porta pellentesque. Pellentesque sagittis do" +
              "lor sodales iaculis vestibulum. In bibendum dignissim mauris. Duis vitae mauris " +
              "vel sem facilisis suscipit a porttitor ex. Suspendisse convallis mauris turpis, " +
              "vel viverra tortor tempor at.",
          senderName: 'You'
        }
      ]
    }
  }

  render() {
    return (
      <div className='wrapper'>
        <div className='task'>
          <div className='innertask'>
            <div className='toptask'>
              <Button
                shape="circle"
                icon="arrow-left"
                size='large'
                style={{
                margin: 15
              }}/>
            </div>
            <div className='middletask'>
              <h1 style={{
                color: 'white'
              }}>TASK</h1>
              <br/>
              <Timeline style={{color: 'white'}}>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">
                  <p>Solve initial network problems 3 2015-09-01</p>
                </Timeline.Item>
                <Timeline.Item>
                  <p>Technical testing 3 2015-09-01</p>
                </Timeline.Item>
              </Timeline>
            </div>
          </div>
          <div className='member'>
            a
          </div>
        </div>
        <div className='chatbox'>
          <div
            className='chattext'
            style={{
            marginLeft: 15,
            marginRight: 15
          }}>
            <ChatFeed messages={this.state.messages} // Boolean: list of message objects
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
          </div>
          <div className='chatinput'>
            <Input
              size='large'
              placeholder='chat box..'
              style={{
              width: '82%',
              marginRight: '1%'
            }}/>
            <Button ghost style={{
              width: '10%'
            }}>Send</Button>
          </div>
        </div>
        <div className='minnie'></div>
      </div>
    )
  }
}

export default ChatRoom