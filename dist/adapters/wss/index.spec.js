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

var serviceAdapter = _interopRequireWildcard(_index);

var _datafile = require('datafile');

var _npacUtils = require('../npacUtils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('service', function () {
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

    var config = _.merge({}, _config2.default, {/* Add command specific config parameters */});
    var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, serviceAdapter.startup];

    var terminators = [serviceAdapter.shutdown, pdms.shutdown];

    it('#TBD', function (done) {

        (0, _npacUtils.catchExitSignals)(sandbox, done);

        var testJob = function testJob(container, next) {
            //            const expected = serviceTestData
            //            const results = container.service.serviceFunction()
            //            expect(results).to.eql(expected)
            next(null, null);
        };

        (0, _npacUtils.npacStart)(adapters, [testJob], terminators);
    }).timeout(10000);
});