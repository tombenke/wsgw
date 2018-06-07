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

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var serviceConfig = _lodash2.default.merge({}, _config2.default, { service: container.config.service || {} });
    container.logger.info('Start up service adapter');

    // Call next setup function with the context extension
    next(null, {
        config: serviceConfig,
        service: {}
    });
};

/**
 * The shutdown function of the service adapter
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
    container.logger.info("Shut down service adapter");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};