#!/usr/bin/env node

/*jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _webServer = require('./adapters/webServer/');

var _webServer2 = _interopRequireDefault(_webServer);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _commands = require('./commands/');

var _commands2 = _interopRequireDefault(_commands);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var callCommand = function callCommand(command) {
    return command.type === 'sync' ? _npac2.default.makeCallSync(command) : _npac2.default.makeCall(command);
};

var start = exports.start = function start() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


    var defaults = _lodash2.default.merge({}, _config2.default, _npacPdmsHemeraAdapter2.default.defaults, _webServer2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);

    // Use CLI to gain additional parameters, and command to execute

    var _cli$parse = _cli2.default.parse(defaults, argv),
        cliConfig = _cli$parse.cliConfig,
        command = _cli$parse.command;
    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [callCommand(command)];
    // Define the adapters and executives to add to the container
    var appAdapters = command.name === 'server' ? [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _npacPdmsHemeraAdapter2.default.startup, _webServer2.default.startup, _npacWsgwAdapters.wsServer.startup, _npacWsgwAdapters.wsPdmsGw.startup, _commands2.default] : command.args.channelType === 'NATS' ? [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _npacPdmsHemeraAdapter2.default.startup, _commands2.default] : [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _commands2.default];

    var appTerminators = command.name === 'server' ? [_npacWsgwAdapters.wsPdmsGw.shutdown, _npacWsgwAdapters.wsServer.shutdown, _webServer2.default.shutdown, _npacPdmsHemeraAdapter2.default.shutdown] : command.args.channelType === 'NATS' ? [_npacPdmsHemeraAdapter2.default.shutdown] : [];

    //Start the container
    console.log(command, appTerminators, jobs);
    _npac2.default.start(appAdapters, jobs, appTerminators, function (err, res) {
        //        if (command.name !== 'server') {
        process.kill(process.pid, 'SIGTERM');
        //        }
    });
};