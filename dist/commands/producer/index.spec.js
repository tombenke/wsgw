'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _fixtures = require('./fixtures/');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('commands/producer', function () {

    it('#loadMessagesFromFile -  messages only', function () {
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(__dirname + '/fixtures/test_scenario.yml')).to.eql(_fixtures.testScenario);
    });

    it('#loadMessagesFromFile -  messages and files mixed', function () {
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(__dirname + '/fixtures/test_scenario_mixed.yml')).to.eql(_fixtures.testScenarioMixed);
    });
});