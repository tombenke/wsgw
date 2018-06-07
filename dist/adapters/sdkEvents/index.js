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

var getSdkEvents = function getSdkEvents(container, request, cb) {
    container.logger.info('getSdkEvents called: ' + JSON.stringify(request, null, '  '));
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
            "timestamp": "1516814252",
            "event": "SECQUEUE"
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c67",
            "timestamp": "1516845253",
            "event": "SECPASS"
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c67",
            "timestamp": "1516816254",
            "event": "SECQUEUE"
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c22",
            "timestamp": "1516847255",
            "event": "SECPASS"
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c22",
            "timestamp": "1516818256",
            "event": "SECQUEUE"
        }, {
            "recordingId": "94170373-8bd2-4bfd-92ef-de588cab2c13",
            "timestamp": "1516843252",
            "event": "SECPASS"
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
    var sdkEventsConfig = _lodash2.default.merge({}, _config2.default, { sdkEvents: container.config.sdkEvents || {} });
    container.logger.info('Start up sdkEvents adapter');

    // Register PDMS service(s)
    container.pdms.add({ topic: "/sdk/events", method: "get", uri: "/sdk/events" }, function (data, cb) {
        getSdkEvents(container, data.request, cb);
    });

    // Call next setup function with the context extension
    next(null, {
        config: sdkEventsConfig,
        sdkEvents: {
            // No direct API is provided by this module
        }
    });
};

/**
 * The shutdown function of the sdkEvents adapter
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
    container.logger.info("Shut down sdkEvents adapter");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};