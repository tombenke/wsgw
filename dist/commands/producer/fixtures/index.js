'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testScenarioMixed = exports.testScenario = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testScenario = exports.testScenario = (0, _datafile.loadJsonFileSync)(__dirname + '/test_scenario.yml');
var message1 = (0, _datafile.loadJsonFileSync)(__dirname + '/message1.yml');
//const message2 = loadJsonFileSync(__dirname + '/message2.yml')
var testScenarioMixed = exports.testScenarioMixed = _lodash2.default.chain((0, _datafile.loadJsonFileSync)(__dirname + '/test_scenario_mixed.yml')).map(function (item, idx) {
    return idx === 1 ? { delay: item.delay, message: message1 } : item;
}).value();