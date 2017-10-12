const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.database()
const axios = require('axios')
const stringSimilarity = require('string-similarity')

const TOKEN = functions.config().dandelion.token

module.exports = payload => {
  const { 
    roomId,
    topic,
    chat: {
      data: {
        text
      }
    }
  } = payload

  const apiUrl = `https://us-central1-minutes-vart.cloudfunctions.net/watsonNLU?text=${text}` 
  axios.get(apiUrl)
  .then(({ data }) => {
    //object to array
    const parseTopic = Object.keys(topic.categories || {}).map(key => topic.categories[key])
    
    topicCategories = parseTopic.map(category => category.label) // topic: array of category label
    
    const dataCategories = data.categories || []
    messageCategories = dataCategories.map(category => category.label) // message: array of category label
    
    let bestMatch = 0
    
    if (dataCategories.length > 0) {
      let similiarityArr = []
      
      topicCategories.forEach(topicLabel => {
        messageCategories.forEach(messageLabel => {
          similiarityArr.push(stringSimilarity.compareTwoStrings(topicLabel, messageLabel))
        })
      })
            
      bestMatch = similiarityArr.reduce((prev, next) => next > prev ? next : prev)
    } 
    
    if (data.categories.length > 0 && bestMatch > 0.4) {
      
      // add to minnie/notes
      const needToNotedScore = data.categories.map(category => category.score).reduce((prev, next) => next > prev ? next : prev)
      if (needToNotedScore > 0.65)
        db.ref(`rooms/${roomId}/minnie/notes`).push(payload.chat)
      
      return db.ref(`rooms/${roomId}/minnie/relevantChat`).push(payload.chat)
      
    } else if (bestMatch <= 0.4) {
      
      // counter unrelevantChat
      return db.ref(`rooms/${roomId}/minnie/unrelevantChat`).once('value')
      .then(snapshot => {
        return db.ref(`rooms/${roomId}/minnie/unrelevantChat`).set((snapshot.val() || 0) + 1)
      })
      
    } else {
      return null
    }
  })
  .catch(err => Promise.reject(err))
}