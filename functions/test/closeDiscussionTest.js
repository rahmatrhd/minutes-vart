const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const arrToObj = require('../closeDiscussion/helpers/arrToObj')
const contributionRate = require('../closeDiscussion/helpers/contributionRate')
const discussionProductivity = require('../closeDiscussion/helpers/discussionProductivity')
const Duration = require('../closeDiscussion/helpers/Duration')
const durationCalc = require('../closeDiscussion/helpers/durationCalc')
const focusness = require('../closeDiscussion/helpers/focusness')
const participationRate = require('../closeDiscussion/helpers/participationRate')
const reportCalc = require('../closeDiscussion/helpers/reportCalc')

const participant = [
  {id: 0, name: 'john'},
  {id: 1, name: 'doe'}
]
const chats = [
  {id: 0, senderName: 'john', message: 'this is dummy message'},
  {id: 0, senderName: 'john', message: 'this is dummy message'},
  {id: 1, senderName: 'doe', message: 'this is dummy message'},
  {id: 0, senderName: 'john', message: 'this is dummy message'},
  {id: 0, senderName: 'john', message: 'this is dummy message'},
  {id: 1, senderName: 'doe', message: 'this is dummy message'},
  {id: 1, senderName: 'doe', message: 'this is dummy message'},
  {id: 0, senderName: 'john', message: 'this is dummy message'},
  {id: 1, senderName: 'doe', message: 'this is dummy message'}
]
const notes = [
  {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 0, name: 'john'}
  }, {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 1, name: 'doe'}
  }, {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 0, name: 'john'}
  },
]
const relevantChats = [
  {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 0, name: 'john'}
  }, {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 1, name: 'doe'}
  }, {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 0, name: 'john'}
  }, {
    type: 'text',
    data: {text: 'this is dummy message'},
    user: {id: 1, name: 'doe'}
  }
]
const dataRoom = {
  chat: {
    0: {id: 0, senderName: 'john', message: 'this is dummy message'},
    1: {id: 0, senderName: 'john', message: 'this is dummy message'},
    2: {id: 1, senderName: 'doe', message: 'this is dummy message'},
    3: {id: 0, senderName: 'john', message: 'this is dummy message'},
    4: {id: 0, senderName: 'john', message: 'this is dummy message'},
    5: {id: 1, senderName: 'doe', message: 'this is dummy message'},
    6: {id: 1, senderName: 'doe', message: 'this is dummy message'},
    7: {id: 0, senderName: 'john', message: 'this is dummy message'},
    8: {id: 1, senderName: 'doe', message: 'this is dummy message'},
  },
  minnie: {
    notes: {
      0: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 0, name: 'john'}
      },
      1: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 1, name: 'doe'}
      },
      2: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 0, name: 'john'}
      }
    },
    relevantChat: {
      0: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 0, name: 'john'}
      },
      1: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 1, name: 'doe'}
      },
      2: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 0, name: 'john'}
      },
      
      3: {
        type: 'text',
        data: {text: 'this is dummy message'},
        user: {id: 1, name: 'doe'}
      }
    },
    todo: {
      0: {
        task: 'dummy task',
        timestamp: 1507639528961,
        userId: '0',
        userName: 'john'
      },
      1: {
        task: 'dummy task',
        timestamp: 1507639528961,
        userId: '1',
        userName: 'doe'
      },
      2: {
        task: 'dummy task',
        timestamp: 1507639528961,
        userId: '0',
        userName: 'john'
      }
    },
    unrelevantChat: 2
  },
  participant: {
    0: {id: 0, name: 'john'},
    1: {id: 1, name: 'doe'}
  },
  status: true,
  timestamp: 1507639528961,
  topic: {
    text: 'dummy topic',
    categories: {
      0: {score: 0.5, label: '/technology'},
      1: {score: 0.5, label: '/movie'},
      2: {score: 0.5, label: '/fashion'}
    }
  }
}

// arrToObj
describe('Array to Object helper function', () => {
  const dummyArr = ['data1', 'data2', 'data3']
  const result = arrToObj(dummyArr)
  
  it('should be an instance of Object', () => {
    expect(result).to.be.an.instanceof(Object)
    expect(Object.keys(result)).to.have.lengthOf(dummyArr.length)
  })
  it('have same data value', () => {
    for (let i = 0; i < dummyArr.length; i++)
      expect(result[i]).to.be.equal(dummyArr[i])
  })
})

// durationCalc
describe('Duration Calculate and class Duration', () => {
  const result = durationCalc(Date.now() - 9000)
  
  it('instance of Duration', () => {
    expect(result).to.be.an.instanceof(Duration)
  })
  
  it('have minimal states', () => {
    expect(result).to.have.property('duration')
    expect(result).to.have.property('milisecond')
    expect(result).to.have.property('second')
    expect(result).to.have.property('minute')
  })
})

// discussionProductivity
describe('Discussion productivity rate function', () => {
  const result = discussionProductivity(relevantChats, chats)
  
  it('should return a number less than equal 1', () => {
    expect(result).to.be.lte(1)
  })
  
  it('return not NaN', () => {
    expect(result).to.be.not.NaN
  })
})

// contributionRate
describe('User contribution rate function', () => {
  const result = contributionRate(participant, notes)
  const resultEmpty = contributionRate()
  
  it('return array of users', () => {
    expect(result).to.have.lengthOf(participant.length)
  })
  
  it('have score field in each item of array', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i]).to.have.property('score')
  })
  
  it('score field is not NaN', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i].score).to.be.not.NaN
  })
  
  it('(Empty) have score field in each item of array', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i]).to.have.property('score')
  })
  
  it('(Empty) score field is not NaN', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i].score).to.be.not.NaN
  })
})

// focusness
describe('User Focusness function', () => {
  const result = focusness(participant, relevantChats, chats)
  const resultEmpty = focusness()

  it('return array of users', () => {
    expect(result).to.have.lengthOf(participant.length)
  })
  
  it('have score field in each item of array', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i]).to.have.property('score')
  })
  
  it('score field is not NaN', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i].score).to.be.not.NaN
  })
  
  it('(Empty) have score field in each item of array', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i]).to.have.property('score')
  })
  
  it('(Empty) score field is not NaN', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i].score).to.be.not.NaN
  })
})

// participationRate
describe('Participation Rate function', () => {
  const result = participationRate(participant, relevantChats)
  const resultEmpty = participationRate()
  
  it('return array of users', () => {
    expect(result).to.have.lengthOf(participant.length)
  })
  
  it('have score field in each item of array', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i]).to.have.property('score')
  })
  
  it('score field is not NaN', () => {
    for (let i = 0; i < result.length; i++)
      expect(result[i].score).to.be.not.NaN
  })
  
  it('(Empty) have score field in each item of array', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i]).to.have.property('score')
  })
  
  it('(Empty) score field is not NaN', () => {
    for (let i = 0; i < resultEmpty.length; i++)
      expect(resultEmpty[i].score).to.be.not.NaN
  })
})

// reportCalc
describe('Report calculation function', () => {
  const result = reportCalc(dataRoom)
  
  it('return object', () => {
    expect(result).to.be.an.instanceof(Object)
  })
  
  it('have minimal properties', () => {
    expect(result).to.have.property('status')
    expect(result).to.have.property('timestamp')
    expect(result).to.have.property('topic')
    expect(result).to.have.property('todo')
    expect(result).to.have.property('notes')
    expect(result).to.have.property('participant')
    expect(result).to.have.property('report')
  })
  
  it('have report detail', () => {
    expect(result).to.have.nested.property('report.duration')
    expect(result).to.have.nested.property('report.relevantChat')
    expect(result).to.have.nested.property('report.userParticipationRate')
    expect(result).to.have.nested.property('report.userContributionRate')
    expect(result).to.have.nested.property('report.userFocusness')
    expect(result).to.have.nested.property('report.discussionProductivity')
  })
  
  it('have topic detail', () => {
    expect(result).to.have.nested.property('topic.text')
    expect(result).to.have.nested.property('topic.categories')
  })
})

//closeDiscussion
describe('close Discussion endpoint', () => {
  const closeDiscussionEndpoint = 'https://us-central1-minutes-vart.cloudfunctions.net/closeDiscussion'
  
  it('response OK', done => {
    chai.request(closeDiscussionEndpoint)
    .get('/?room_id=001')
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      done()
    })
  }).timeout(5000)
})