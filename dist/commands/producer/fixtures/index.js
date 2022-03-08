'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testScenarioMixed = exports.testSingleMessage = exports.testScenario = exports.embeddedResults = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var embeddedResults = exports.embeddedResults = (0, _datafile.loadJsonFileSync)(__dirname + '/embedded_results.json');
var testScenario = exports.testScenario = (0, _datafile.loadJsonFileSync)(__dirname + '/test_scenario.yml');
var message1 = (0, _datafile.loadJsonFileSync)(__dirname + '/message1.yml');
var testSingleMessage = exports.testSingleMessage = [{ delay: 0, topic: 'topic1', message: message1 }];
var testScenarioMixed = exports.testScenarioMixed = _lodash2.default.chain((0, _datafile.loadJsonFileSync)(__dirname + '/test_scenario_mixed.yml')).map(function (item, idx) {
    return idx === 1 ? { delay: item.delay, topic: item.topic, message: message1 } : item;
}).value();