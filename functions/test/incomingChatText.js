const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const incomingChatEndpoint = 'https://us-central1-minutes-vart.cloudfunctions.net/incomingChat'

// sendChatToAI
describe('incoming chat endpoint', () => {
  const data = {
    roomId: 'dummyRoomId',
    chat: {
      user: {
        id: 0,
        name: 'john'
      },
      type: 'text',
      data: {
        text: 'assign clean the room to jaenal'
      }
    }
  }
  
  it('response OK', done => {
    chai.request(incomingChatEndpoint)
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