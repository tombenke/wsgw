'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var pdms = _interopRequireWildcard(_npacPdmsHemeraAdapter);

var _wsServer = require('../wsServer/');

var wsServer = _interopRequireWildcard(_wsServer);

var _config3 = require('../wsServer/config');

var _config4 = _interopRequireDefault(_config3);

var _index = require('./index');

var wsPdmsGw = _interopRequireWildcard(_index);

var _datafile = require('datafile');

var _npacUtils = require('../npacUtils');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('wsPdmsGw', function () {
    var sandbox = void 0;

    beforeEach(function (done) {
        (0, _npacUtils.removeSignalHandlers)();
        sandbox = _sinon2.default.sandbox.create({/* useFakeTimers: false */});
        done();
    });

    afterEach(function (done) {
        (0, _npacUtils.removeSignalHandlers)();
        sandbox.restore();
        done();
    });

    var config = _.merge({}, _config2.default, _config4.default, _.setWith({}, 'wsServer.forwardTopics', true), _.setWith({}, 'wsPdmsGw.topics.inbound', ['IN']), _.setWith({}, 'wsPdmsGw.topics.outbound', ['OUT']));

    var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, wsServer.startup, wsPdmsGw.startup];

    var terminators = [wsPdmsGw.shutdown, wsServer.shutdown, pdms.shutdown];

    var setupPdmsShortCircuit = function setupPdmsShortCircuit(container, inTopic, outTopic) {
        container.pdms.add({ pubsub$: true, topic: outTopic }, function (data) {
            container.logger.info('PdmsShortCircuit receives from NATS(' + outTopic + ') data: ' + JSON.stringify(data));
            var msgToForward = _.merge({}, data, { 'pubsub$': true, topic: inTopic });
            container.logger.info('PdmsShortCircuit responses data: ' + JSON.stringify(msgToForward) + ' to NATS(' + inTopic + ')');
            container.pdms.act(msgToForward);
        });
    };

    it('message sending loopback through NATS', function (done) {

        (0, _npacUtils.catchExitSignals)(sandbox, done);

        var testJob = function testJob(container, next) {
            var serverUri = 'http://localhost:' + config.wsServer.port;
            var inMessage = { topic: 'IN', data: 'data' };
            var outMessage = { topic: 'OUT', data: 'data' };
            var producerClient = (0, _socket2.default)(serverUri, { reconnection: false });
            var consumerClient = (0, _socket2.default)(serverUri, { reconnection: false });

            setupPdmsShortCircuit(container, 'IN', 'OUT');

            // Subscribe to the 'IN' channel to catch the loopback response
            consumerClient.on('IN', function (data) {
                console.log('consumerClient received from WS(IN): ', data);
                (0, _chai.expect)(data).to.eql(inMessage);
                next(null, null);
            });

            // Send a message with topic: 'OUT', that will be forwarded to the 'OUT' channel
            producerClient.emit('message', outMessage);
            //clientProducer.emit('message', inMessage)
        };

        (0, _npacUtils.npacStart)(adapters, [testJob], terminators);
    }).timeout(10000);
});