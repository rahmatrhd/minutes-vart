const functions = require('firebase-functions')
const axios = require('axios')

const assignTodo = require('./actionHandlers/assignTodo')

const TOKEN = functions.config().api_ai.dev_token

module.exports = payload => {
  const {
    roomId,
    chat: {
      user: {
        id: userId
      },
      data: {
        text
      }
    }
  } = payload
  
  const url = 'https://api.dialogflow.com/v1/query?v=20150910'
  axios.post(url, {
    query: text,
    sessionId: roomId,
    timezone: new Date(),
    lang: 'en'
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
  .then(({data}) => {
    
    const actionHandlers = {
      'assign_todo': () => assignTodo(data),
      'assign_todo.person_confirm_yes': () => assignTodo(data, userId),
      'default': () => Promise.resolve(null)
    }
    
    const action = !actionHandlers[data.result.action] ? 'default' : data.result.action
    
    return Promise.resolve(actionHandlers[action]())
  })
  .catch(err => Promise.reject(err))
}