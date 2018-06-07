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

var getSdkConfig = function getSdkConfig(container, request, cb) {
    container.logger.info('getSdkConfig called: ' + JSON.stringify(request, null, '  '));
    // TODO: Implement the REST/Hemera call to the SDK backend service, and remove the mock data below
    var response = {
        headers: {},
        body: {
            "config": "some config data..."
        }
    };
    cb(null, response);
};

var putSdkConfig = function putSdkConfig(container, request, cb) {
    container.logger.info('putSdkConfig called: ' + JSON.stringify(request, null, '  '));
    // TODO: Implement the REST/Hemera call to the SDK backend service, and remove the mock data below
    var response = {
        headers: {},
        body: {
            "config": "some config data after PUT..."
        }
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
    var sdkConfigConfig = _lodash2.default.merge({}, _config2.default, { sdkConfig: container.config.sdkConfig || {} });
    container.logger.info('Start up sdkConfig adapter');

    // Register PDMS service(s)
    container.pdms.add({ topic: "/sdk/config", method: "get", uri: "/sdk/config" }, function (data, cb) {
        getSdkConfig(container, data.request, cb);
    });

    // Register PDMS service(s)
    container.pdms.add({ topic: "/sdk/config", method: "put", uri: "/sdk/config" }, function (data, cb) {
        putSdkConfig(container, data.request, cb);
    });

    // Call next setup function with the context extension
    next(null, {
        config: sdkConfigConfig,
        sdkConfig: {
            // No direct API is provided by this module
        }
    });
};

/**
 * The shutdown function of the sdkConfig adapter
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
    container.logger.info("Shut down sdkConfig adapter");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};