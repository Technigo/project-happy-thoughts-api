import ThoughtService from '../thought-service.js'
import sinon from 'sinon'

describe('thought service tests', () => {
  it('has a module', () => {
    expect(ThoughtService).toBeDefined()
  }),
    describe('listThoughts test', () => {
      it('lists Thoughts', () => {
        /* Mock model to imitate the find function */
        const MockModel = {
          find: () => {}
        }

        /* We create a stub to imitate chained methods */
        sinon.stub(MockModel, 'find').callsFake(() => {
          return {
            sort: () => {
              return {
                limit: sinon.stub().returns()
              }
            }
          }
        })
        const thoughtService = ThoughtService(MockModel)
        thoughtService.listThoughts()
        const expected = true
        const actual = MockModel.find.calledOnce
        expect(actual).toEqual(expected)
      })
    }),
    describe('createThought test', () => {
      it('creates a thought', () => {
        const save = sinon.spy()
        let message

        const MockModel = data => {
          message = data.message
          return {
            ...data,
            save
          }
        }
        const thoughtService = ThoughtService(MockModel)

        thoughtService.createThought('test message')
        const expected = true
        const actual = save.calledOnce

        expect(actual).toEqual(expected)
        expect(message).toEqual('test message')
      })
    }),
    describe('updateLike test', () => {
      it('updates the heart count', () => {
        const MockModel = {
          findOneAndUpdate: sinon.spy()
        }
        const thoughtService = ThoughtService(MockModel)
        thoughtService.updateLikes()
        const expected = true
        const actual = MockModel.findOneAndUpdate.calledOnce
        expect(actual).toEqual(expected)
      })
    })
})
