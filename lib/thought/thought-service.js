const createThought = Thought => message => {
  if (!message) {
    throw new Error(`Message: ${message}`)
  }
  const thought = new Thought({ message: message })
  return thought.save()
}

const listThoughts = Thought => number => {
  return Thought.find({})
    .sort({ _id: 'desc' })
    .limit(number)
}

const updateLikes = Thought => id => {
  const thought = Thought.findOneAndUpdate({ _id: id }, { $inc: { hearts: 1 } }, { new: true })
  return thought
}

module.exports = Thought => {
  return {
    createThought: createThought(Thought),
    listThoughts: listThoughts(Thought),
    updateLikes: updateLikes(Thought)
  }
}
