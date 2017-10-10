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
      const { 
        topic = {},
        chat = {}, 
        timestamp = 0, 
        participant = {}, 
        minnie = {}
      } = data
            
      const {
        relevantChat = {},
        notes = {},
        todo = {}
      } = minnie  
      
      // computing
      // parsing data
      const participantArr = Object.keys(participant).map(key => participant[key])
      const chatArr = Object.keys(chat).map(key => chat[key])
      const relevantChatArr = Object.keys(relevantChat).map(key => relevantChat[key])
      const notesArr = Object.keys(notes).map(key => notes[key])
      console.log('consts', participantArr, chatArr, relevantChatArr, notesArr)
          
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
        score: hashUserRelevantChat[user.id] / relevantChatArr.length || 0
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
        score: hashUserNotes[user.id] / notesArr.length || 0
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
        score: hashUserRelevantChat[user.id] / hashUserChat[user.id] || 0
      }))
      console.log('hashUserChat', hashUserChat, userFocusness)
      
      // discussion efficiency
      const discussionEfficiency = relevantChatArr.length / chatArr.length
      
      // discussion productivity rate (per hour)
      const discussionProductivity = discussionEfficiency / duration.getTotalHours
      console.log('discussion', discussionEfficiency, discussionProductivity)
      
      Object.keys(todo).forEach(key => {
        todo[key].status = true
      })
      console.log('data.minnie.todo', todo)
      console.log('result', {
        notes: notes,
        participant: participant,
        report: {
          duration: durationString,
          userParticipationRate: arrToObj(userParticipationRate),
          userContributionRate: arrToObj(userContributionRate),
          userFocusness: arrToObj(userFocusness),
          discussionEfficiency: discussionEfficiency,
          discussionProductivity: discussionProductivity,
          relevantChat: relevantChat
        },
        timestamp: Date.now(),
        status: false,
        todo: todo,
        topic: {
          text: topic.text || ''
        }
      })
        
      db.ref('history').push({
        notes: notes,
        participant: participant,
        report: {
          duration: durationString,
          userParticipationRate: arrToObj(userParticipationRate),
          userContributionRate: arrToObj(userContributionRate),
          userFocusness: arrToObj(userFocusness),
          discussionEfficiency: discussionEfficiency,
          discussionProductivity: discussionProductivity,
          relevantChat: relevantChat
        },
        timestamp: Date.now(),
        status: false,
        todo: todo,
        topic: {
          text: topic.text || ''
        }
      })
      .then(() => {
        console.log('before delete rooms')
        db.ref(`rooms/${roomId}`).set(null)
        console.log('res.send')
        res.send(true)
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