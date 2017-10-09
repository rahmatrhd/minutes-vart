const admin = require('firebase-admin')
const db = admin.database()
const Duration = require('./Duration')

module.exports = (req, res) => {
  const roomId = req.query.room_id
  
  db.ref(`rooms/${roomId}`).update({status: false})
  .then(() => {
    db.ref(`rooms/${roomId}`).once('value')
    .then(snapshot => {
      console.log('inside then')
      const data = Object.assign({}, snapshot.val())
      const { chat, timestamp, participant, minnie: { relevantChat, notes, todo } } = data
      
      // computing
      // parsing data
      const participantArr = Object.keys(participant).map(key => participant[key])
      const chatArr = Object.keys(chat).map(key => chat[key])
      const relevantChatArr = Object.keys(relevantChat).map(key => relevantChat[key])
      const notesArr = Object.keys(notes).map(key => notes[key])
          
      // duration
      const duration = new Duration(Date.now() - timestamp)
      const durationString = `${duration.getHours}:${duration.getMinutes}`
      console.log('duration', duration, durationString)
      
      // user participation rate
      let hashUserRelevantChat = {} // hash table
      relevantChatArr.forEach(chat => {
        hashUserRelevantChat[chat.user.id] = hashUserRelevantChat[chat.user.id] ? hashUserRelevantChat[chat.user.id] + 1 : 1
      })
      
      const userParticipationRate = participantArr.map(user => ({
        id: user.id,
        name: user.name,
        score: hashUserRelevantChat[user.id] / relevantChatArr.length
      }))
      console.log('hashUserRelevantChat', hashUserRelevantChat, userParticipationRate)
      
      //user contribution rate
      let hashUserNotes = {}
      notesArr.forEach(chat => [
        hashUserNotes[chat.user.id] = hashUserNotes[chat.user.id] ? hashUserNotes[chat.user.id] + 1 : 1
      ])
      
      const userContributionRate = participantArr.map(user => ({
        id: user.id,
        name: user.name,
        score: hashUserNotes[user.id] / notesArr.length
      }))
      console.log('hashUserNotes', hashUserNotes, userContributionRate)
      
      //user focusness
      let hashUserChat = {}
      chatArr.forEach(chat => {
        hashUserChat[chat.id] = hashUserChat[chat.id] ? hashUserChat[chat.id] + 1 : 1
      })
      
      const userFocusness = participantArr.map(user => ({
        id: user.id,
        name: user.name,
        score: hashUserRelevantChat[user.id] / hashUserChat[user.id]
      }))
      console.log('hashUserChat', hashUserChat, userFocusness)
      
      // discussion efficiency
      const discussionEfficiency = relevantChatArr.length / chatArr.length
      
      // discussion productivity rate (per hour)
      const discussionProductivity = discussionEfficiency / duration.getTotalHours
      console.log('discussion', discussionEfficiency, discussionProductivity)
      
      Object.keys(data.minnie.todo).forEach(key => {
        data.minnie.todo[key].status = true
      })
      console.log('data.minnie.todo', data.minnie.todo)
      console.log('result', {
        status: false,
        participant: data.participant,
        timestamp: Date.now(),
        notes: data.minnie.notes,
        todo: data.minnie.todo,
        report: {
          duration: durationString,
          userParticipationRate: arrToObj(userParticipationRate),
          userContributionRate: arrToObj(userContributionRate),
          userFocusness: arrToObj(userFocusness),
          discussionEfficiency: discussionEfficiency,
          discussionProductivity: discussionProductivity
        }
      })
        
      db.ref('history').push({
        status: false,
        topic: {
          text: data.topic.text
        },
        participant: data.participant,
        timestamp: Date.now(),
        notes: data.minnie.notes,
        todo: data.minnie.todo,
        report: {
          duration: durationString,
          userParticipationRate: arrToObj(userParticipationRate),
          userContributionRate: arrToObj(userContributionRate),
          userFocusness: arrToObj(userFocusness),
          discussionEfficiency: discussionEfficiency,
          discussionProductivity: discussionProductivity
        }
      })
      .then(() => {
        db.ref(`rooms/${roomId}`).set(null)
      })
    })
    .catch(err => res.send(err))
  })
  
}

const arrToObj = arr => {
  if (!arr) 
    return null
    
  let result = {}
  arr.forEach((item, index) => {
    result[index] = item
  })
  return result
}