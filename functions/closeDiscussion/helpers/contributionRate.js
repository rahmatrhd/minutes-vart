module.exports = (participant = [], notes = []) => {
  let hashTable = {}
  
  notes.forEach(chat => [
    hashTable[chat.user.id] = (hashTable[chat.user.id] || 0) + 1
  ])
  
  return participant.map(user => ({
    id: user.id,
    name: user.name,
    score: hashTable[user.id] / notes.length || 0
  }))
}