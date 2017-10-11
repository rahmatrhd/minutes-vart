const admin = require('firebase-admin')
const db = admin.database()

const checkRelevant = require('./checkRelevant')
const sendChatToAI = require('./sendChatToAI')

module.exports = (req, res) => {
  const { roomId } = req.body
  db.ref(`rooms/${roomId}/topic`).once('value')
  .then(snapshot => {
    const data = Object.assign({}, req.body, {topic: snapshot.val()})
    
    return Promise.all([
      checkRelevant(data),
      sendChatToAI(data)
    ])
  })
  .then(results => {
    res.send(results[1])
  })
  .catch(err => {
    res.send(err)
  })
}