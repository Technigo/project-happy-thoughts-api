import request from 'supertest'
import 'babel-polyfill' /* For some reason needed for async/await testing */
import app from '../app.js'

/* Need to access the database to test like functionality */
import mongoose from 'mongoose'
import Thought from '../../lib/thought/thought-model.js'
const mongoUrl = 'mongodb://localhost/happyThoughtsTest'

const PORT = 3001

let server

beforeAll(async () => {
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.Promise = Promise
  await Thought.deleteMany({})
  server = app.listen(PORT)
})

afterAll(done => {
  mongoose.connection.close()
  server.close(done)
})

describe('route testing', () => {
  it('can get thoughts', async () => {
    await request(server)
      .get('/')
      .expect(200)
  }),
    it('can post thoughts', async () => {
      await request(server)
        .post('/')
        .send({ message: 'test message' })
        .expect(200)
    }),
    it('returns error if message is less than 5 characters or longer than 140', async () => {
      await request(server)
        .post('/')
        .send({ message: 'fail' })
        .expect(500)
      let msg = 'fail'
      for (let i = 0; i < 50; i++) {
        msg += 'fail'
      }
      await request(server)
        .post('/')
        .send({ message: msg })
        .expect(500)
    })
  it('can post likes', async () => {
    const thought = await new Thought({ message: 'test msg' }).save()
    await request(server)
      .post(`/${thought._id}/like`)
      .expect(200)
  }),
    it('shows error if using wrong endpoint', async () => {
      await request(server)
        .post('/fail')
        .expect(404)
    })
})
