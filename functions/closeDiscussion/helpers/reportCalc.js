const durationCalc = require('./durationCalc')
const participationRate = require('./participationRate')
const contributionRate = require('./contributionRate')
const focusness = require('./focusness')
const discussionProductivity = require('./discussionProductivity')
const arrToObj = require('./arrToObj')

module.exports = payload => {
  const { 
    topic = {},
    chat = {}, 
    timestamp = 0, 
    participant = {}, 
    minnie = {}
  } = payload
        
  const {
    relevantChat = {},
    notes = {},
    todo = {}
  } = minnie
  
  // parsing data to array
  const participantArr = Object.keys(participant).map(key => participant[key])
  const chatArr = Object.keys(chat).map(key => chat[key])
  const relevantChatArr = Object.keys(relevantChat).map(key => relevantChat[key])
  const notesArr = Object.keys(notes).map(key => notes[key])
  
  // data
  const duration = durationCalc(timestamp)
  const durationString = `${duration.getHours}:${duration.getMinutes}`
  const userParticipationRate = participationRate(participantArr, relevantChatArr)
  const userContributionRate = contributionRate(participantArr, notesArr)
  const userFocusness = focusness(participantArr, relevantChatArr, chatArr)
  const discussionProductivityScore = discussionProductivity(relevantChatArr, chatArr)
  
  // push status to each todo
  Object.keys(todo).forEach(key => {
    todo[key].status = true
  })
  
  return {
    notes: notes,
    participant: participant,
    report: {
      duration: durationString,
      userParticipationRate: arrToObj(userParticipationRate),
      userContributionRate: arrToObj(userContributionRate),
      userFocusness: arrToObj(userFocusness),
      discussionProductivity: discussionProductivityScore,
      relevantChat: relevantChat
    },
    timestamp: Date.now(),
    status: false,
    todo: todo,
    topic: topic
  }
}