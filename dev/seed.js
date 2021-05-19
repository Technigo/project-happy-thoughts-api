import Thought from '../models/thoughtsModel'
import data from './data.json'

export default async () => {
  await Thought.deleteMany({})

  data.forEach((modelData) => {
    new Thought(modelData).save()
  })
}