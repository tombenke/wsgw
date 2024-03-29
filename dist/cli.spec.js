'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _npacWsgwAdapters2 = _interopRequireDefault(_npacWsgwAdapters);

var _webServer = require('./adapters/webServer/');

var _webServer2 = _interopRequireDefault(_webServer);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('cli', function () {
    console.log('wsServer: ' + _npacWsgwAdapters2.default);
    var defaults = _lodash2.default.merge({}, _config2.default, _npacPdmsHemeraAdapter2.default.defaults, _webServer2.default.defaults, _npacWsgwAdapters2.default.defaults);

    it('#parse - server command with defaults', function (done) {
        var processArgv = ['node', 'src/index.js', 'server'];
        var expected = {
            command: {
                name: 'server',
                type: 'async',
                args: {}
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                wsServer: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                webServer: {
                    port: 8001
                },
                pdms: {
                    natsUri: 'nats://localhost:4222'
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
                type: 'async',
                args: {}
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                wsServer: {
                    topics: {
                        inbound: ['IN1', 'IN2', 'IN3'],
                        outbound: ['OUT1', 'OUT2', 'OUT3']
                    }
                },
                webServer: {
                    port: 8002
                },
                pdms: {
                    natsUri: 'nats://localhost:4222'
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
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'message',
                    uri: 'http://localhost:8001'
                }
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                }
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
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'MY_TOPIC',
                    uri: 'wss://ws.mydomain.com:1234'
                }
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                }
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
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'message',
                    uri: 'http://localhost:8001',
                    message: null,
                    messageContent: null,
                    scenario: null,
                    dumpMessages: false,
                    rpc: false
                }
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('#parse producer command with full list of args', function (done) {
        var processArgv = ['node', 'src/index.js', 'producer', '-u', 'wss://ws.mydomain.com:1234', '-t', 'MY_TOPIC', '-m', '{ "topic": "MY_TOPIC", "payload": "Some payload..."}', '-c', 'message-content.json', '-s', '/fixtures/test_scenario.yml', '-d', '-r'];
        var expected = {
            command: {
                name: 'producer',
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'MY_TOPIC',
                    uri: 'wss://ws.mydomain.com:1234',
                    message: { topic: 'MY_TOPIC', payload: 'Some payload...' },
                    messageContent: _path2.default.resolve('message-content.json'),
                    scenario: '/fixtures/test_scenario.yml',
                    dumpMessages: true,
                    rpc: true
                }
            },
            cliConfig: {
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});