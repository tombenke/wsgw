'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import _ from 'lodash'
//import { start } from './index'
//import { setupNatsLoopbacks } from './examples/natsLoopback.js'
//import ioClient from 'socket.io-client'

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
    /*
        const executeCommand = (args) => {
            console.log(`executeCommand(${args})`)
            return new Promise((resolve, reject) => {
                start(_.concat(['node', 'src/index.js'], args), (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        console.log('npac startup process and run jobs successfully finished')
                        resolve(res)
                    }
                })
            })
        }
    
        const stopServer = () => {
            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        }
    
        it('#server, #producer - Loopback through NATS', (done) => {
    
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            //const natsUri = 'nats:localhost:4222'
            const natsUri = "nats://demo.nats.io:4222"
            const wsServerUri = 'http://localhost:8001'
    
            setupNatsLoopbacks(natsUri, [['OUT1', 'IN1'], ['OUT2', 'IN2'], ['OUT2', 'IN3']])
    
            console.log('will start server')
            executeCommand([
                'server',
                '-f',
                '-n', natsUri,
                '-i', 'IN1,IN2,IN3', '-o', 'OUT1,OUT2'
            ]).then(() => {
                console.log('Server started')
                const wsClient = ioClient(wsServerUri)
                wsClient.on('IN1', data => {
                    console.log(`[IN1] >> ${JSON.stringify(data)}`)
                    console.log('will stop server')
                    stopServer()
                })
    
                console.log('will execute producer')
                executeCommand([
                    'producer',
                    '-m', '{"topic": "OUT1", "payload": "Some payload"}'
                    // '-s', 'src/commands/producer/fixtures/test_scenario.yml'
                ]).then(() => {
                    console.log('Message sending completed')
                }).catch(err => done(err))
            }).catch(err => done(err))
        }).timeout(30000)
        */
});