#!/usr/bin/env node

/*jshint node: true */
'use strict';

/**
 * 'server' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */

exports.execute = function (container, args) {
  container.logger.info(container.config.app.name + ' server ' + JSON.stringify(args));
};