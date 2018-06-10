'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _wsPdmsGw = require('./adapters/wsPdmsGw/');

var _wsPdmsGw2 = _interopRequireDefault(_wsPdmsGw);

var _wsServer = require('./adapters/wsServer/');

var _wsServer2 = _interopRequireDefault(_wsServer);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('cli', function () {
    var defaults = _lodash2.default.merge({}, _config2.default, _npacPdmsHemeraAdapter2.default.defaults, _wsServer2.default.defaults, _wsPdmsGw2.default.defaults);

    it('#parse - server command with defaults', function (done) {
        var processArgv = ['node', 'src/index.js', 'server'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: false,
                    forwarderEvent: "message",
                    port: 8001
                },
                wsPdmsGw: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                pdms: {
                    natsUri: "nats://demo.nats.io:4222"
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse - server command with full list of args', function (done) {
        var processArgv = ['node', 'src/index.js', 'server', '-c', 'config.yml', '-f', '-e', 'fwd$', '-i', 'IN1,IN2, IN3', '-o', 'OUT1, OUT2 ,OUT3', '-n', 'nats://localhost:4222', '-p', '8002'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: true,
                    forwarderEvent: "fwd$",
                    port: 8002
                },
                wsPdmsGw: {
                    topics: {
                        inbound: ['IN1', 'IN2', 'IN3'],
                        outbound: ['OUT1', 'OUT2', 'OUT3']
                    }
                },
                pdms: {
                    natsUri: "nats://localhost:4222"
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse consumer command with defaults', function (done) {
        var processArgv = ['node', 'src/index.js', 'consumer'];
        var expected = {
            command: {
                name: 'consumer',
                args: {
                    topic: "message",
                    uri: "http://localhost:8001"
                }
            },
            cliConfig: {
                configFileName: "config.yml"
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse consumer command with full list of args', function (done) {
        var processArgv = ['node', 'src/index.js', 'consumer', '-c', 'config.yml', '-u', 'wss://ws.mydomain.com:1234', '-t', 'MY_TOPIC'];
        var expected = {
            command: {
                name: 'consumer',
                args: {
                    topic: "MY_TOPIC",
                    uri: "wss://ws.mydomain.com:1234"
                }
            },
            cliConfig: {
                configFileName: "config.yml"
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse producer command with defaults', function (done) {
        var processArgv = ['node', 'src/index.js', 'producer'];
        var expected = {
            command: {
                name: 'producer',
                args: {
                    topic: "message",
                    uri: "http://localhost:8001",
                    message: null,
                    source: null
                }
            },
            cliConfig: {
                configFileName: "config.yml"
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse producer command with full list of args', function (done) {
        var processArgv = ['node', 'src/index.js', 'producer', '-c', 'config.yml', '-u', 'wss://ws.mydomain.com:1234', '-t', 'MY_TOPIC', '-m', '{ "topic": "MY_TOPIC", "payload": "Some payload..."}', '-s', '/fixtures/test_scenario.yml'];
        var expected = {
            command: {
                name: 'producer',
                args: {
                    topic: "MY_TOPIC",
                    uri: "wss://ws.mydomain.com:1234",
                    message: { topic: "MY_TOPIC", payload: "Some payload..." },
                    source: '/fixtures/test_scenario.yml'
                }
            },
            cliConfig: {
                configFileName: "config.yml"
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});