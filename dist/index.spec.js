'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var pdms = _interopRequireWildcard(_npacPdmsHemeraAdapter);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _wsServer = require('./adapters/wsServer/');

var _wsServer2 = _interopRequireDefault(_wsServer);

var _wsPdmsGw = require('./adapters/wsPdmsGw/');

var _wsPdmsGw2 = _interopRequireDefault(_wsPdmsGw);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'
*/

//import { start } from './index'

var testDirectory = _path2.default.resolve('./tmp');

var destCleanup = function destCleanup(cb) {
    var dest = testDirectory;
    (0, _rimraf2.default)(dest, cb);
};

describe('app', function () {
    var sandbox = void 0;

    before(function (done) {
        destCleanup(function () {
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    after(function (done) {
        destCleanup(done);
    });

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

    it('#start, #stop', function (done) {

        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var config = _lodash2.default.merge({}, _config2.default, pdms.defaults, {/* Add command specific config parameters */});
        /*
        const processArgv = [
            'node', 'src/index.js'
        ]
        */
        var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, _wsServer2.default.startup, _wsPdmsGw2.default.startup
        // TODO: Add BL adapter
        ];

        var terminators = [_wsPdmsGw2.default.shutdown, _wsServer2.default.shutdown, pdms.shutdown];

        var testModule = function testModule(container, next) {
            container.logger.info('Run job to test the module');
            // TODO: Implement endpoint testing
            next(null, {});
        };

        _npac2.default.start(adapters, [testModule], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    }).timeout(10000);
});