'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var pdms = _interopRequireWildcard(_npacPdmsHemeraAdapter);

var _index = require('./index');

var sdkEvents = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { expect } from 'chai'
describe('sdkEvents', function () {

    var config = _.merge({}, _config2.default, {/* Add command specific config parameters */});

    it('GET /sdk/events', function (done) {
        var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, sdkEvents.startup];

        var testSdkEvents = function testSdkEvents(container, next) {
            container.logger.info('Run job to test sdkEvents');
            // TODO: Implement endpoint testing
            container.pdms.act({
                topic: "/sdk/events",
                method: "get",
                uri: "/sdk/events",
                endpointDesc: {}, //endpoint,
                req: {} // req
            }, function (err, resp) {
                //TODO: expect....
                container.logger.info('RES: ' + err + ', ' + JSON.stringify(resp, null, ''));
                if (err) {
                    //                    res.status(500).json(err)
                } else {
                        //                    res.status(200).json(resp)
                    }
                next(null, null);
            });
        };

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        var shutdownSdkEvents = function shutdownSdkEvents(container, next) {
            container.logger.info('Run job to stop sdkEvents');
            pdms.shutdown(container, next);
        };

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        var shutdownPdms = function shutdownPdms(container, next) {
            container.logger.info('Run job to stop pdms');
            pdms.shutdown(container, next);
        };

        _npac2.default.start(adapters, [testSdkEvents, shutdownSdkEvents, shutdownPdms], function (err, res) {
            if (err) {
                throw err;
            } else {
                done();
            }
        });
    });
});