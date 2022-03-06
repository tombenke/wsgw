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
    var getChannelType = function getChannelType(serverUri) {
        return serverUri.match(/^nats:.*/) ? 'NATS' : 'WS';
    };

    yargs(processArgv.slice(2)).command('server', 'Run in server mode', function (yargs) {
        return yargs.option('config', {
            alias: 'c',
            desc: 'The name of the configuration file',
            default: defaults.configFileName
        }).option('logLevel', {
            alias: 'l',
            desc: 'The log level',
            default: defaults.logger.level
        }).option('logFormat', {
            alias: 'f',
            desc: 'The log (`plainText` or `json`)',
            type: 'string',
            default: defaults.logger.transports.console.format
        }).option('port', {
            alias: 'p',
            desc: 'The webSocket server port',
            type: 'number',
            default: defaults.webServer.port
        }).option('inbound', {
            alias: 'i',
            desc: 'Comma separated list of inbound NATS topics to forward through websocket',
            type: 'string',
            default: ''
        }).option('outbound', {
            alias: 'o',
            desc: 'Comma separated list of outbound NATS topics to forward towards from websocket',
            type: 'string',
            default: ''
        }).option('natsUri', {
            alias: 'n',
            desc: 'NATS server URI used by the pdms adapter.',
            type: 'string',
            default: defaults.pdms.natsUri
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'server',
                type: 'async',
                args: {}
            },
            cliConfig: {
                configFileName: argv.config,
                logger: {
                    level: argv.logLevel,
                    transports: {
                        console: {
                            format: argv.logFormat
                        }
                    }
                },
                wsServer: {
                    topics: {
                        inbound: argv.inbound != '' ? _lodash2.default.map(argv.inbound.split(','), function (t) {
                            return t.trim();
                        }) : [],
                        outbound: argv.outbound != '' ? _lodash2.default.map(argv.outbound.split(','), function (t) {
                            return t.trim();
                        }) : []
                    }
                },
                webServer: {
                    port: argv.port
                },
                pdms: {
                    natsUri: argv.natsUri
                }
            }
        };
    }).command('producer', 'Run as a producer client', function (yargs) {
        return yargs.option('config', {
            alias: 'c',
            desc: 'The name of the configuration file',
            default: defaults.configFileName
        }).option('logLevel', {
            alias: 'l',
            desc: 'The log level',
            default: defaults.logger.level
        }).option('logFormat', {
            alias: 'f',
            desc: 'The log (`plainText` or `json`)',
            type: 'string',
            default: defaults.logger.transports.console.format
        }).option('uri', {
            alias: 'u',
            desc: 'The URI of the WebSocket server',
            type: 'string',
            default: 'http://localhost:8001'
        }).option('topic', {
            alias: 't',
            desc: 'The topic (event name) the message will be sent',
            type: 'string',
            default: 'message'
        }).option('message', {
            alias: 'm',
            desc: 'The JSON-format message string to send',
            type: 'String',
            default: null
        }).option('source', {
            alias: 's',
            desc: 'The name of the YAML or JSON format source file that holds the messages to send',
            type: 'String',
            default: null
        }).option('dumpMessages', {
            alias: 'd',
            desc: 'Dump the complete messages list to send after loading',
            type: 'boolean',
            default: false
        }).option('rpc', {
            alias: 'r',
            desc: 'Do RPC-like, synchronous call through NATS',
            type: 'boolean',
            default: false
        }).demandOption([]);
    }, function (argv) {
        var channelType = getChannelType(argv.uri);
        results = {
            command: {
                name: 'producer',
                type: 'async',
                args: {
                    channelType: channelType,
                    uri: argv.uri,
                    topic: argv.topic,
                    message: argv.message != null && _lodash2.default.isString(argv.message) ? JSON.parse(argv.message) : null,
                    source: argv.source != null && _lodash2.default.isString(argv.source) ? _path2.default.resolve(argv.source) : null,
                    dumpMessages: argv.dumpMessages,
                    rpc: argv.rpc
                }
            },
            cliConfig: channelType === 'NATS' ? {
                configFileName: argv.config,
                pdms: {
                    natsUri: argv.uri
                },
                logger: {
                    level: argv.logLevel,
                    transports: {
                        console: {
                            format: argv.logFormat
                        }
                    }
                }
            } : {
                configFileName: argv.config,
                logger: {
                    level: argv.logLevel,
                    transports: {
                        console: {
                            format: argv.logFormat
                        }
                    }
                }
            }
        };
    }).command('consumer', 'Run as a consumer client', function (yargs) {
        return yargs.option('config', {
            alias: 'c',
            desc: 'The name of the configuration file',
            default: defaults.configFileName
        }).option('logLevel', {
            alias: 'l',
            desc: 'The log level',
            default: defaults.logger.level
        }).option('logFormat', {
            alias: 'f',
            desc: 'The log (`plainText` or `json`)',
            type: 'string',
            default: defaults.logger.transports.console.format
        }).option('uri', {
            alias: 'u',
            desc: 'The URI of the WebSocket server',
            type: 'string',
            default: 'http://localhost:8001'
        }).option('topic', {
            alias: 't',
            desc: 'The topic (event name) the message will be sent',
            type: 'string',
            default: 'message'
        }).demandOption([]);
    }, function (argv) {
        var channelType = getChannelType(argv.uri);
        results = {
            command: {
                name: 'consumer',
                type: 'async',
                args: {
                    channelType: channelType,
                    uri: argv.uri,
                    topic: argv.topic
                }
            },
            cliConfig: channelType === 'NATS' ? {
                configFileName: argv.config,
                pdms: {
                    natsUri: argv.uri
                },
                logger: {
                    level: argv.logLevel,
                    transports: {
                        console: {
                            format: argv.logFormat
                        }
                    }
                }
            } : {
                configFileName: argv.config,
                logger: {
                    level: argv.logLevel,
                    transports: {
                        console: {
                            format: argv.logFormat
                        }
                    }
                }
            }
        };
    }).showHelpOnFail(false, 'Specify --help for available options').help().parse();

    return results;
};

module.exports = {
    parse: parse
};