const admin = require('firebase-admin')
const db = admin.database()

const checkRelevant = require('./checkRelevant')
const sendChatToAI = require('./sendChatToAI')

module.exports = (req, res) => {
  const { roomId } = req.body
  db.ref(`rooms/${roomId}/topic`).once('value')
  .then(snapshot => {
    const payload = req.body
    payload.topic = snapshot.val()
    
    return Promise.all([
      checkRelevant(req.body),
      sendChatToAI(req.body)
    ])
  })
  .then(() => res.send({}))
  .catch(err => res.send(err))
}