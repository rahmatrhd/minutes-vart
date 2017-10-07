const admin = require('firebase-admin')
const db = admin.database()
const Duration = require('./Duration')

module.exports = (req, res) => {
  const roomId = req.query.room_id
  
  db.ref(`rooms/${roomId}`).once('value')
  .then(snapshot => {
    const data = Object.assign({}, snapshot.val())
    const { topic, chat, timestamp, participant, minnie: { relevantChat, notes, todo } } = data
    
    // computing
    // parsing data
    const participantArr = Object.keys(participant).map(key => participant[key])
    const chatArr = Object.keys(chat).map(key => chat[key])
    const relevantChatArr = Object.keys(relevantChat).map(key => relevantChat[key])
    const notesArr = Object.keys(notes).map(key => notes[key])
        
    // duration
    const duration = new Duration(Date.now() - timestamp)
    const durationString = `${duration.getHours}:${duration.getMinutes}`
    
    // user participation rate
    let hashUserRelevantChat = {} // hash table
    relevantChatArr.forEach(chat => {
      hashUserRelevantChat[chat.user.id] = hashUserRelevantChat[chat.user.id] ? hashUserRelevantChat[chat.user.id] + 1 : 1
    })
    
    const userParicipationRate = participantArr.map(user => ({
      id: user.id,
      name: user.name,
      score: hashUserRelevantChat[user.id] / relevantChatArr.length
    }))
    
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
    
    // discussion efficiency
    const discussionEfficiency = relevantChatArr.length / chatArr.length
    
    // discussion productivity rate (per hour)
    const discussionProductivity = discussionEfficiency / duration.getTotalHours
    db.ref(`summary`).push({
      status: true,
      topic,
      participant,
      minnie: data.minnie,
      todo,
      report: {
        duration: durationString,
        userParicipationRate,
        userContributionRate,
        userFocusness,
        discussionEfficiency,
        discussionProductivity
      }
    })
    db.ref(`rooms/${roomId}`).set(null)
  })
  .catch(err => res.send(err))
}