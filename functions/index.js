const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')
admin.initializeApp(functions.config().firebase)

const incomingChat = require('./incomingChat/incomingChat')
const watsonNLU = require('./watsonNLU/watsonNLU')
const closeDiscussion = require('./closeDiscussion/closeDiscussion')
const submitReview = require('./submitReview/submitReview')

exports.incomingChat = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    incomingChat(req, res)
  })
})

exports.watsonNLU = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    watsonNLU(req, res)
  })
})

exports.closeDiscussion = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    closeDiscussion(req, res)
  })
})

exports.submitReview = functions.https.onRequest((req, res) => {
	cors()(req, res, () => {
		submitReview(req, res)
	})
})