const functions = require('firebase-functions')
const axios = require('axios')
const assignTodo = require('./assignTodo')

const TOKEN = functions.config().api_ai.dev_token

module.exports = payload => {
  const { roomId, chat: { user: { id: sessionId }, data: { text: query }} } = payload
  const url = 'https://api.api.ai/v1/query?v=20150910'
  return axios.post(url, {
    query,
    sessionId,
    timezone: new Date(),
    lang: 'en',
    originalRequest: {
      source: 'minutes',
      data: {
        roomId
      }
    }
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
  .then(({data}) => {
    const actionHandlers = {
      'assign_todo': () => assignTodo(roomId, data),
      'default': () => {
        return {
          result: null
        }
      }
    }
    
    const action = !actionHandlers[data.result.action] ? 'default' : data.result.action
    return actionHandlers[action]()
  })
}