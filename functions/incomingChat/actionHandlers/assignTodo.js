const functions = require('firebase-functions')
const axios = require('axios')
const admin = require('firebase-admin')
const db = admin.database()
const stringSimilarity = require('string-similarity')

const TOKEN = functions.config().api_ai.dev_token

module.exports = (data, userId) => {
  const {
    result: {
      parameters: {
        task,
        person
      }
    },
    sessionId
  } = data
  
  if (task && person)
    return db.ref('users').once('value')
    .then(snapshot => {
      const keys = Object.keys(snapshot.val())
      const userNames = keys.map(key => snapshot.val()[key].name) // array of user's name

      const similarityScore = userNames.map(name => stringSimilarity.compareTwoStrings(person, name))
      const bestMatch = similarityScore.reduce((prev, next) => next > prev ? next : prev)

      if (bestMatch > 0.6) {
        const index = similarityScore.indexOf(bestMatch)
        console.log('best')
        // if userId exist and match with assignedTo (keys[index]) OR no userId provided
        if ((userId && (userId == keys[index])) || !userId) {
          console.log('halo')
          if (userId)
            axios.delete(`https://api.dialogflow.com/v1/contexts/pre-todo-assigntoperson-followup?sessionId=${sessionId}`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
              }
            })
          
          return db.ref(`rooms/${sessionId}/minnie/todo`).push({
            task,
            userId: keys[index],
            userName: userNames[index],
            timestamp: Date.now()
          })
        } else {
          console.log('resulve null')
          return Promise.resolve(null)
        }
      } else {
        console.log('userUndefined')
        return Promise.resolve({
          userUndefined: true,
          name: person
        })
      }
    })
    .catch(err => Promise.reject(err))
  else
    return Promise.resolve(null)
}