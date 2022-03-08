import npac from 'npac'
import { expect } from 'chai'
import { testSingleMessage, testScenario, testScenarioMixed, embeddedResults } from './fixtures/'
import { loadMessageContentFromFile, loadMessagesFromScenarioFile } from './index'

describe('commands/producer', () => {
    const container = { logger: console }

    it('#loadMessageContentFromFile', () => {
        const fileName = __dirname + '/fixtures/message1.yml'
        expect(loadMessageContentFromFile(container, 0, 'topic1', fileName)).to.eql(testSingleMessage)
    })

    it('#loadMessagesFromScenarioFile -  messages only', () => {
        const fileName = __dirname + '/fixtures/test_scenario.yml'
        expect(loadMessagesFromScenarioFile(container, 'topic1', fileName)).to.eql(testScenario)
    })

    it('#loadMessagesFromFile -  messages and files mixed', () => {
        const fileName = __dirname + '/fixtures/test_scenario_mixed.yml'
        expect(loadMessagesFromScenarioFile(container, 'TMA', fileName)).to.eql(testScenarioMixed)
    })

    it('#loadMessagesFromFile -  messages and files mixed with embedded sub-scenario', () => {
        const fileName = __dirname + '/fixtures/test_scenario_nested_L0.yml'
        expect(loadMessagesFromScenarioFile(container, 'TMA', fileName)).to.eql(embeddedResults)
    })
})
