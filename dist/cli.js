'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yargs = require('yargs');

var parse = function parse(defaults) {
    var processArgv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;

    var results = {};

    yargs(processArgv.slice(2)).command('server', 'Run in server mode', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("forward", {
            alias: "f",
            desc: "Forwards messages among inbound and outbound topics",
            type: 'boolean',
            default: defaults.wsServer.forwardTopics
        }).option("port", {
            alias: "p",
            desc: "The webSocket server port",
            type: 'number',
            default: defaults.wsServer.port
        }).option("natsUri", {
            alias: "n",
            desc: "NATS server URI used by the pdms adapter.",
            type: 'string',
            default: defaults.pdms.natsUri
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: argv.config,
                wsServer: {
                    forwardTopics: argv.forward,
                    port: argv.port
                },
                pdms: {
                    natsUri: argv.natsUri
                }
            }
        };
    }).command('producer', 'Run as a producer client', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("uri", {
            alias: "u",
            desc: "The URI of the WebSocket server",
            type: 'string',
            default: "http://localhost:8001"
        }).option("topic", {
            alias: "t",
            desc: "The topic (event name) the message will be sent",
            type: 'string',
            default: "message"
        }).option("message", {
            alias: "m",
            desc: "The JSON-format message string to send",
            type: 'String',
            default: null
        }).option("source", {
            alias: "s",
            desc: "The name of the YAML or JSON format source file that holds the messages to send",
            type: 'String',
            default: null
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'producer',
                args: {
                    uri: argv.uri,
                    topic: argv.topic,
                    message: argv.message != null && _lodash2.default.isString(argv.message) ? JSON.parse(argv.message) : null,
                    source: argv.source != null && _lodash2.default.isString(argv.source) ? _path2.default.resolve(argv.source) : null
                }
            },
            cliConfig: {
                configFileName: argv.config
            }
        };
    }).command('consumer', 'Run as a consumer client', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("uri", {
            alias: "u",
            desc: "The URI of the WebSocket server",
            type: 'string',
            default: "http://localhost:8001"
        }).option("topic", {
            alias: "t",
            desc: "The topic (event name) the message will be sent",
            type: 'string',
            default: "message"
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'consumer',
                args: {
                    uri: argv.uri,
                    topic: argv.topic
                }
            },
            cliConfig: {
                configFileName: argv.config
            }
        };
    }).showHelpOnFail(false, 'Specify --help for available options').help().parse();

    return results;

    /*
    const argv = yargs()
        .option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        })
        .option("forward", {
            alias: "f",
            desc: "Forwards messages among inbound and outbound topics",
            type: 'boolean',
            default: defaults.wsServer.forwardTopics
        })
        .option("natsUri", {
            alias: "n",
            desc: "NATS server URI used by the pdms adapter.",
            type: 'string',
            default: defaults.pdms.natsUri
        })
        .demandOption([])
        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse(processArgv.slice(2))
     const results = {
        command: {
            name: 'none',
            args: {},
        },
        cliConfig: {
            configFileName: argv.config,
            wsServer: {
                forwardTopics: argv.forward
            },
            pdms: {
                natsUri: argv.natsUri
            }
        }
    }
    console.log(results)
    return results
    */
};

module.exports = {
    parse: parse
};