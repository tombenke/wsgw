import npac from 'npac'
import { expect } from 'chai'
import { testSingleMessage, testScenario, testScenarioMixed } from './fixtures/'
import { loadMessagesFromFile } from './index'

describe('commands/producer', () => {

    it('#loadMessagesFromFile -  single message', () => {
        expect(loadMessagesFromFile(__dirname + '/fixtures/message1.yml'))
            .to.eql(testSingleMessage)
    })

    it('#loadMessagesFromFile -  messages only', () => {
        expect(loadMessagesFromFile(__dirname + '/fixtures/test_scenario.yml'))
            .to.eql(testScenario)
    })

    it('#loadMessagesFromFile -  messages and files mixed', () => {
        expect(loadMessagesFromFile(__dirname + '/fixtures/test_scenario_mixed.yml'))
            .to.eql(testScenarioMixed)
    })
})
