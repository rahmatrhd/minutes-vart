module.exports = arr => {
  if (!arr)
    return null
    
  let result = {}
  arr.forEach((item, index) => {
    result[index] = item
  })
  return result
}