import mongoose from 'mongoose'
import 'babel-polyfill'

const initTestDb = async number => {
  const mongoUrl = 'mongodb://localhost/happyThoughtsTest'
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.Promise = Promise

  const Thought = mongoose.model('Thought', {
    message: String,
    hearts: Number
  })

  /* Rest test db */
  await Thought.deleteMany({})

  for (let i = 0; i < number; i++) {
    const likes = Math.round(Math.random() * 20) /* Randomize no of likes 0-9*/
    const thought = new Thought({
      message: `Test message ${i} !`,
      hearts: likes
    })
    thought.save()
  }
}

beforeAll(done => {
  initTestDb(30)
  done()
})

afterAll(() => {})

describe('GET /', () => {
  test.todo('should test that the main end-point / returns an array of the 20 latest Thoughts of the corret format')
})

describe('GET /:id', () => {
  test.todo('should test that a request with an ID returns the thought object for that ID'),
    test.todo('should test that a request with an invalid ID returns a 404 error')
})

describe('POST /', () => {
  test.todo('should test that a post request with a thought returns that thought with an ObjectID'),
    test.todo('should test that an empty post request returns a 404 error')
})
describe('POST /:id/like', () => {
  test.todo('should test that a post request with url :id/like returns the object with :id'),
    test.todo('should test that a post to :id/like with an invalid ID returns a 404 error')
})
//
