const functions = require('firebase-functions')
const { username, password } = functions.config().watson

const NLU = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nlu = new NLU({
  username,
  password,
  version_date: '2017-02-27'
})

module.exports = (req, res) => {
  nlu.analyze({
    text: req.query.text,
    features: {
      categories: {}
    }
  }, (err, response) => {
    if (err)
      res.send(err)
    else
      res.send({
        text: req.query.text,
        categories: response.categories || []
      })
  })
}