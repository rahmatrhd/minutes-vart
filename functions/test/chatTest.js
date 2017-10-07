const chai = require('chai')
const axios = require('axios')
const firebase = require('firebase')
const url = 'http://localhost:5000/minutes-vart/us-central1/'

const config = {
  apiKey: "AIzaSyDQiAP5PfSYOaPItrqLJRU50m4k3asw1Ys",
  authDomain: "minutes-vart.firebaseapp.com",
  databaseURL: "https://minutes-vart.firebaseio.com",
  projectId: "minutes-vart",
  storageBucket: "minutes-vart.appspot.com",
  messagingSenderId: "987319535932"
}
firebaseApp = firebase.initializeApp(config)
const db = firebaseApp.database()

// db.ref('rooms').set('asd')

describe('sending chat', () => {
  it('return id dari datbase', (done) => {
    const sendChatToDatabase = require('../controllers/sendChatToDatabase')
    
    const fakePayload = {
      type: 'text',
      data: {
        text: 'test message'
      },
      timestamp: Date.now(),
      user: '001'
    }
    
    const result = sendChatToDatabase(fakePayload)
    expect(result).to.have.lengthOf(20)
    expect(result).to.be.an.instanceof(String)
  })
})

describe('get discussion result', () => {
  it('return expected result', () => {
    const getDiscussionResult = require('../controllers/getDiscussionResult')
    
    const fakePayload = {
      topic: 'car',
      users: {
        1: {
          name: 'rahmat',
          leader: true
        },
        2: {
          name: 'tama',
          leader: false
        }
      },
      minnie: {
        relevantChat: {
          1: {
            type: 'text',
            data: {
              text: 'this car is good man'
            },
            timestamp: Date.now(),
            user: '001'
          }
        },
        todo: {
          1: {
            task: 'buy some spareparts',
            user: '001'
          },
          2: {
            task: 'eat som foods',
            user: '002'
          }
        },
        media: {}
      }
    }
    
    const result = getDiscussionResult(fakePayload)
    expect(result).to.have.property('topic')
    expect(result).to.have.property('usersChat')
    expect(result).to.have.property('timestamp')
    expect(result).to.have.property('summary')
    expect(result).to.have.property('media')
  })
})