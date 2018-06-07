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

var _index = require('./index');

var wsServer = _interopRequireWildcard(_index);

var _datafile = require('datafile');

var _npacUtils = require('../npacUtils');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('wsServer', function () {
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

    var config = _.merge({}, _config2.default, _.setWith({}, 'wsServer.forwardTopics', true));
    console.log(config);
    var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, wsServer.startup];

    var terminators = [wsServer.shutdown, pdms.shutdown];

    it('message sending loopback', function (done) {

        (0, _npacUtils.catchExitSignals)(sandbox, done);

        var testJob = function testJob(container, next) {
            var serverUri = 'http://localhost:' + config.wsServer.port;
            var message = { topic: 'XYZ', data: 'data' };
            var clientProducer = (0, _socket2.default)(serverUri);
            var clientConsumer = (0, _socket2.default)(serverUri);

            // Subscribe to the 'XYZ' channel to catch the loopback response
            clientConsumer.on(message.topic, function (data) {
                console.log('data arrived: ', data);
                (0, _chai.expect)(data).to.eql(message);
                clientProducer.close();
                clientConsumer.close();
                next(null, null);
            });

            // Send a message with topic: 'XYZ', that will be forwarded to the 'XYZ' channel
            clientProducer.emit('message', message);
        };

        (0, _npacUtils.npacStart)(adapters, [testJob], terminators);
    }).timeout(10000);
});