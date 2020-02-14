/**
 * Tests the database connections for needed operations (create, get and update like)
 */

import 'babel-polyfill' /* For some reason needed for async/await testing */
import mongoose from 'mongoose'
import Thought from '../thought-model.js'
const mongoUrl = 'mongodb://localhost/happyThoughtsTest'

beforeAll(async () => {
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.Promise = Promise
  await Thought.deleteMany({})
})

afterEach(async () => {
  Thought.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('thought model tests', () => {
  it('can create a thought', async () => {
    await new Thought({ message: 'test thought' }).save()
    const thoughtsCount = await Thought.countDocuments()
    expect(thoughtsCount).toEqual(1)
  }),
    it('can fetch a thought', async () => {
      const thought = await new Thought({ message: 'test message' }).save()
      const fetchedThought = await Thought.findOne({ _id: thought.id })
      expect(thought._id).toEqual(fetchedThought._id)
    }),
    it('can update likes on a thought', async () => {
      const thought = await new Thought({ message: 'test message' }).save()
      const fetchedThought = await Thought.findOneAndUpdate(
        { _id: thought._id },
        { $inc: { hearts: 1 } },
        { new: true }
      )
      expect(fetchedThought.hearts).toEqual(1)
    })
})
