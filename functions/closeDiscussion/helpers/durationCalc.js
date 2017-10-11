const Duration = require('./Duration')

module.exports = timestamp => {
  return new Duration(Date.now() - timestamp)
}