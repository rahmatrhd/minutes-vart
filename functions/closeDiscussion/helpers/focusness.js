module.exports = (participant = [], relevantChats = [], chats = []) => {
  let hashTableRelevant = {}
  let hashTableChat = {}
  
  relevantChats.forEach(chat => {
    hashTableRelevant[chat.id] = (hashTableRelevant[chat.id] || 0) + 1
  })
  
  chats.forEach(chat => {
    hashTableChat[chat.id] = (hashTableChat[chat.id] || 0) + 1
  })
  
  return participant.map(user => ({
    id: user.id,
    name: user.name,
    score: hashTableRelevant[user.id] / hashTableChat[user.id] || 0
  }))
}