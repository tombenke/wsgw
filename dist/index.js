#!/usr/bin/env node

/*jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _wsServer = require('./adapters/wsServer/');

var _wsServer2 = _interopRequireDefault(_wsServer);

var _wsPdmsGw = require('./adapters/wsPdmsGw/');

var _wsPdmsGw2 = _interopRequireDefault(_wsPdmsGw);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var start = exports.start = function start() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


    var defaults = _lodash2.default.merge({}, _config2.default, _npacPdmsHemeraAdapter2.default.defaults, _wsServer2.default.defaults, _wsPdmsGw2.default.defaults);

    // Use CLI to gain additional parameters, and command to execute

    var _cli$parse = _cli2.default.parse(defaults, argv),
        cliConfig = _cli$parse.cliConfig;
    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the adapters and executives to add to the container
    var appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _npacPdmsHemeraAdapter2.default.startup, _wsServer2.default.startup, _wsPdmsGw2.default.startup];

    var appTerminators = [_wsPdmsGw2.default.shutdown, _wsServer2.default.shutdown, _npacPdmsHemeraAdapter2.default.shutdown];

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [];

    //Start the container
    _npac2.default.start(appAdapters, jobs, appTerminators, cb);
};