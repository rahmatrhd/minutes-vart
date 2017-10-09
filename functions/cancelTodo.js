const admin = require('firebase-admin')
const db = admin.database()

module.exports = roomId => {
  db.ref(`rooms/${roomId}/minnie/todo`).limitToLast(1).once('value')
  .then(snapshot => {
    const key = Object.keys(snapshot.val())[0]
    db.ref(`rooms/${roomId}/minnie/todo/${key}`).remove()
  })
}