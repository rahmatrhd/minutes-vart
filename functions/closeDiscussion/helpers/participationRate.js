module.exports = (participant = [], relevantChats = []) => {
  let hashTable = {}
  
  relevantChats.forEach(chat => {
    hashTable[chat.user.id] = (hashTable[chat.user.id] || 0) + 1
  })
  
  return participant.map(user => ({
    id: user.id,
    name: user.name,
    score: hashTable[user.id] / relevantChats.length || 0
  }))
}