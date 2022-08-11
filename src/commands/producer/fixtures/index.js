import _ from 'lodash'
import { loadJsonFileSync } from 'datafile'

export const embeddedResults = loadJsonFileSync(__dirname + '/embedded_results.json')
export const testScenario = loadJsonFileSync(__dirname + '/test_scenario.yml')
export const testScenarioExpected = loadJsonFileSync(__dirname + '/test_scenario_expected.yml')
const message1 = loadJsonFileSync(__dirname + '/message1.yml')
export const testSingleMessage = [{ delay: 0, topic: 'topic1', durable: false, message: message1 }]
export const testScenarioMixed = _.chain(loadJsonFileSync(__dirname + '/test_scenario_mixed.yml'))
    .map((item, idx) => (idx === 1 ? { delay: item.delay, topic: item.topic, message: message1 } : item))
    .value()
export const testScenarioMixedExpected = loadJsonFileSync(__dirname + '/test_scenario_mixed_expected.json')
