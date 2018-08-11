'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _fixtures = require('./fixtures/');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('commands/producer', function () {

    it('#loadMessagesFromFile -  single message', function () {
        var fileName = __dirname + '/fixtures/message1.yml';
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(fileName, fileName, 0)).to.eql(_fixtures.testSingleMessage);
    });

    it('#loadMessagesFromFile -  messages only', function () {
        var fileName = __dirname + '/fixtures/test_scenario.yml';
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(fileName, fileName, 0)).to.eql(_fixtures.testScenario);
    });

    it('#loadMessagesFromFile -  messages and files mixed', function () {
        var fileName = __dirname + '/fixtures/test_scenario_mixed.yml';
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(fileName, fileName, 0)).to.eql(_fixtures.testScenarioMixed);
    });

    it('#loadMessagesFromFile -  messages and files mixed with embedded scenario', function () {
        var fileName = __dirname + '/fixtures/test_scenario_embedded.yml';
        //        console.log(JSON.stringify(loadMessagesFromFile(fileName, fileName, 0), null, '  '))
        (0, _chai.expect)((0, _index.loadMessagesFromFile)(fileName, fileName, 0)).to.eql(_fixtures.embeddedResults);
    });
});