import { expect } from 'chai'
import config from './config'

before(done => { done() })
after(done => { done() })

describe('wsServer.config', () => {

    it('#defaults', done => {
        const expected = {
            wsServer: {
                forwardTopics: false,
                port: 8001
            }
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
