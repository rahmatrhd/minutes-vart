const admin = require('firebase-admin')
const db = admin.database()

const reportCalc = require('./helpers/reportCalc')

module.exports = (req, res) => {
  const roomId = req.query.room_id
  const newKey = db.ref('history').push().key
  
  db.ref(`rooms/${roomId}`).update({status: false})
  .then(() => db.ref(`rooms/${roomId}`).once('value'))
  .then(snapshot => {
    const newHistory = reportCalc(snapshot.val())
    console.log('newHistory', newHistory)
    return db.ref('history').child(newKey).set(newHistory)
  })
  .then(() => db.ref(`rooms/${roomId}`).set(null))
  .then(() => res.send(newKey))
  .catch(err => res.send(err))
  
}