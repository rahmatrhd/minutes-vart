const admin = require('firebase-admin')
const db = admin.database()
const stringSimilarity = require('string-similarity')

module.exports = (roomId, data) => {
  const { result: { parameters: { task, person } }, sessionId } = data
  
  if (task && person)
    db.ref('users').once('value')
    .then(snapshot => {    
      const keys = Object.keys(snapshot.val())
      const userNames = keys.map(key => snapshot.val()[key].name)

      const similarityScore = userNames.map(name => stringSimilarity.compareTwoStrings(person, name))
      const bestMatch = similarityScore.reduce((prev, next) => next > prev ? next : prev)

      if (bestMatch > 0.6) {
        const index = similarityScore.indexOf(bestMatch)
        if (sessionId == keys[index])
          db.ref(`rooms/${roomId}/minnie/todo`).push({
            task,
            userId: keys[index],
            userName: userNames[index],
            timestamp: Date.now()
          })
      }
    })
}