'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _index = require('./index');

var _natsLoopback = require('./examples/natsLoopback.js');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('app', function () {
    var sandbox = void 0;

    var removeSignalHandlers = function removeSignalHandlers() {
        var signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2'];
        for (var signal in signals) {
            process.removeAllListeners(signals[signal]);
        }
    };

    beforeEach(function (done) {
        removeSignalHandlers();
        sandbox = _sinon2.default.sandbox.create({ useFakeTimers: false });
        done();
    });

    afterEach(function (done) {
        removeSignalHandlers();
        sandbox.restore();
        done();
    });

    var executeCommand = function executeCommand(args) {
        return new Promise(function (resolve, reject) {
            (0, _index.start)(_lodash2.default.concat(['node', 'src/index.js'], args), function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    console.log('npac startup process and run jobs successfully finished');
                    resolve(res);
                }
            });
        });
    };

    var stopServer = function stopServer() {
        console.log('Send SIGTERM signal');
        process.kill(process.pid, 'SIGTERM');
    };

    it('#server, #producer - Loopback through NATS', function (done) {

        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        //const natsUri = 'nats:localhost:4222'
        var natsUri = "nats://demo.nats.io:4222";
        var wsServerUri = 'http://localhost:8001';

        (0, _natsLoopback.setupNatsLoopbacks)(natsUri, [['OUT1', 'IN1'], ['OUT2', 'IN2'], ['OUT2', 'IN3']]);

        console.log('will start server');
        executeCommand(['server', '-f', '-n', natsUri, '-i', 'IN1,IN2,IN3', '-o', 'OUT1,OUT2']).then(function () {
            var wsClient = (0, _socket2.default)(wsServerUri);
            wsClient.on('IN1', function (data) {
                console.log('[IN1] >> ' + JSON.stringify(data));
                console.log('will stop server');
                stopServer();
            });

            console.log('will execute producer');
            executeCommand(['producer', '-m', '{"topic": "OUT1", "payload": "Some payload"}'
            //'-s', 'src/commands/producer/fixtures/test_scenario.yml'
            ]).then(function () {
                console.log('Message sending completed');
            });
        });
    }).timeout(30000);
});
//import { expect } from 'chai'