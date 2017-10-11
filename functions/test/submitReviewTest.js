const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const submitReviewEndpoint = 'https://us-central1-minutes-vart.cloudfunctions.net/submitReview'

// submitReview
describe('submit review endpoint', () => {
  const data = {
    historyId: 'dummyHistoryId',
    todo: {
      0: {
        timestamp: 1507032420003,
        task: 'do some tasks',
        userId: '0',
        userName: 'john',
        status: true
      },
      1: {
        timestamp: 1507032420003,
        task: 'do some tasks',
        userId: '1',
        userName: 'doe',
        status: false
      }
    }
  }
  
  it('response OK', done => {
    chai.request(submitReviewEndpoint)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(data)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      done()
    })
  }).timeout(5000)
})