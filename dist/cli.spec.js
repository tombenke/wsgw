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

    it('parse', function (done) {
        var processArgv = ['node', 'src/index.js', 'server'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: false
                },
                pdms: {
                    natsUri: "nats://demo.nats.io:4222"
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('parse with NATS URI', function (done) {
        var processArgv = ['node', 'src/index.js', 'server', '-c', 'config.yml', '-n', 'nats://localhost:4222'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: false
                },
                pdms: {
                    natsUri: "nats://localhost:4222"
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});