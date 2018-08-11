import npac from 'npac'
import { expect } from 'chai'
import { testSingleMessage, testScenario, testScenarioMixed, embeddedResults } from './fixtures/'
import { loadMessagesFromFile } from './index'

describe('commands/producer', () => {

    it('#loadMessagesFromFile -  single message', () => {
        const fileName = __dirname + '/fixtures/message1.yml'
        expect(loadMessagesFromFile(fileName, fileName, 0)).to.eql(testSingleMessage)
    })

    it('#loadMessagesFromFile -  messages only', () => {
        const fileName = __dirname + '/fixtures/test_scenario.yml'
        expect(loadMessagesFromFile(fileName, fileName, 0)).to.eql(testScenario)
    })

    it('#loadMessagesFromFile -  messages and files mixed', () => {
        const fileName = __dirname + '/fixtures/test_scenario_mixed.yml'
        expect(loadMessagesFromFile(fileName, fileName, 0)).to.eql(testScenarioMixed)
    })

    it('#loadMessagesFromFile -  messages and files mixed with embedded scenario', () => {
        const fileName = __dirname + '/fixtures/test_scenario_embedded.yml'
//        console.log(JSON.stringify(loadMessagesFromFile(fileName, fileName, 0), null, '  '))
        expect(loadMessagesFromFile(fileName, fileName, 0)).to.eql(embeddedResults)
    })
})
