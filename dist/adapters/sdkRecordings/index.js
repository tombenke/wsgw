#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _natsHemera = require('nats-hemera');

var _natsHemera2 = _interopRequireDefault(_natsHemera);

var _nats = require('nats');

var _nats2 = _interopRequireDefault(_nats);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSdkRecordings = function getSdkRecordings(container, request, cb) {
    container.logger.info('getSdkRecordings called: ' + JSON.stringify(request, null, '  '));
    // TODO: Implement the REST/Hemera call to the SDK backend service, and remove the mock data below
    var response = {
        headers: {
            "Access-Control-Expose-Headers": "x-pagination",
            "x-pagination": JSON.stringify({
                "totalCount": 53,
                "prev": {
                    "offset": 0,
                    "limit": 5
                },
                "first": {
                    "offset": 0,
                    "limit": 5
                },
                "last": {
                    "offset": 50,
                    "limit": 3
                },
                "next": {
                    "offset": 15,
                    "limit": 5
                }
            }, null, '')
        },
        body: [{
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c13",
            "originGeoLocation": {
                "lat": 50.048952,
                "lon": 8.573678
            },
            "destinationGeoLocation": {
                "lat": 40.642335,
                "lon": -73.78817
            },
            "flightDate": "2018-01-24T16:21:10.589Z",
            "flightNumber": "LH400",
            "deviceInfo": {
                "osVersion": "11.2.5",
                "platform": "Apple",
                "countryCode": "HU",
                "osType": "iOS",
                "languageCode": "en",
                "deviceId": "4283E67B-64AB-4905-9508-B6D9C1A9B0D4",
                "model": "iPhone 6",
                "locationServicesEnabled": "notEnabled",
                "motionServicesEnabled": "notEnabled",
                "carrier": "Telenor HU"
            },
            "originIata": "FRA",
            "destinationIata": "JFK",
            "context": {
                "activityId": "testActivityId",
                "journeyId": "testJourneyId"
            }
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c15",
            "originGeoLocation": {
                "lat": 50.048952,
                "lon": 8.573678
            },
            "destinationGeoLocation": {
                "lat": 40.642335,
                "lon": -73.78817
            },
            "flightDate": "2018-01-24T16:21:10.589Z",
            "flightNumber": "LH400",
            "deviceInfo": {
                "osVersion": "11.2.5",
                "platform": "Apple",
                "countryCode": "HU",
                "osType": "iOS",
                "languageCode": "en",
                "deviceId": "4283E67B-64AB-4905-9508-B6D9C1A9B0D4",
                "model": "iPhone 6",
                "locationServicesEnabled": "notEnabled",
                "motionServicesEnabled": "notEnabled",
                "carrier": "Telenor HU"
            },
            "originIata": "FRA",
            "destinationIata": "JFK",
            "context": {
                "activityId": "testActivityId",
                "journeyId": "testJourneyId"
            }
        }]
    };
    cb(null, response);
};

/**
 * The startup function of the adapter
 *
 * This function should be registered with the startup phase, then npac will call when the project is starting.
 *
 * @arg {Object} container  - The actual state of the container this adapter will be added
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the pdmsHemera adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var startup = function startup(container, next) {
    // Merges the defaults with the config coming from the outer world
    var sdkRecordingsConfig = _lodash2.default.merge({}, _config2.default, { sdkRecordings: container.config.sdkRecordings || {} });
    container.logger.info('Start up sdkRecordings adapter');

    // Register PDMS service(s)
    container.pdms.add({ topic: "/sdk/recordings", method: "get", uri: "/sdk/recordings" }, function (data, cb) {
        getSdkRecordings(container, data.request, cb);
    });

    // Call next setup function with the context extension
    next(null, {
        config: sdkRecordingsConfig,
        sdkRecordings: {
            // No direct API is provided by this module
        }
    });
};

/**
 * The shutdown function of the sdkRecordings adapter
 *
 * This function should be registered with the shutdown phase, then npac will call when graceful shutdown happens.
 *
 * @arg {Object} container  - The actual state of the container this adapter is running
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the pdmsHemera adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var shutdown = function shutdown(container, next) {
    container.logger.info("Shut down sdkRecordings adapter");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};