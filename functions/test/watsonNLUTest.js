const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const watsonNLUEndpoint = 'https://us-central1-minutes-vart.cloudfunctions.net/watsonNLU'

describe('IBM Watson Natural Language Understanding request', () => {
  it('connection success', done => {
    chai.request(watsonNLUEndpoint)
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      done()
    })
  }).timeout(5000)
  
  it('response have categories', done => {
    const message = 'movie discussion'
    chai.request(watsonNLUEndpoint)
    .get(`/?text=${message}`)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res.body).to.have.property('text')
      expect(res.body).to.have.property('categories')
      done()
    })
  }).timeout(5000)
  
  it('response have categories 0 categories', done => {
    const message = 'my name is rahmat'
    chai.request(watsonNLUEndpoint)
    .get(`/?text=${message}`)
    .end((err, res) => {
      expect(err).to.be.null
      expect(res.body).to.have.property('text')
      expect(res.body).to.have.property('categories')
      expect(res.body.categories).to.have.lengthOf(0)
      done()
    })
  }).timeout(5000)
  
  it('error not enough text', done => {
    const message = 'hahaha lol'
    chai.request(watsonNLUEndpoint)
    .get(`/?text=${message}`)
    .end((err, res) => {
      expect(res.body).to.have.property('error')
      done()
    })
  })
}).timeout(5000)