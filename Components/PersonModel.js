export const Person = mongoose.model('Person', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 500
  },
  height: {
    type: Number,
    required: true,
    min: 5
  },
  birthdate: {
    type: Date,
    default: Date.now()
  }
})
