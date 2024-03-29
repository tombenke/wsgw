import _ from 'lodash'
import path from 'path'

const yargs = require('yargs')

const parse = (defaults, processArgv = process.argv) => {
    let results = {}
    const getChannelType = (serverUri) => (serverUri.match(/^nats:.*/) ? 'NATS' : 'WS')

    yargs(processArgv.slice(2))
        .command(
            'server',
            'Run in server mode',
            (yargs) =>
                yargs
                    .option('logLevel', {
                        alias: 'l',
                        desc: 'The log level',
                        default: defaults.logger.level
                    })
                    .option('logFormat', {
                        alias: 'f',
                        desc: 'The log (`plainText` or `json`)',
                        type: 'string',
                        default: defaults.logger.transports.console.format
                    })
                    .option('port', {
                        alias: 'p',
                        desc: 'The webSocket server port',
                        type: 'number',
                        default: defaults.webServer.port
                    })
                    .option('inbound', {
                        alias: 'i',
                        desc: 'Comma separated list of inbound NATS topics to forward through websocket',
                        type: 'string',
                        default: ''
                    })
                    .option('outbound', {
                        alias: 'o',
                        desc: 'Comma separated list of outbound NATS topics to forward towards from websocket',
                        type: 'string',
                        default: ''
                    })
                    .option('natsUri', {
                        alias: 'n',
                        desc: 'NATS server URI used by the pdms adapter.',
                        type: 'string',
                        default: defaults.pdms.natsUri
                    })
                    .demandOption([]),
            (argv) => {
                results = {
                    command: {
                        name: 'server',
                        type: 'async',
                        args: {}
                    },
                    cliConfig: {
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
                                inbound: argv.inbound != '' ? _.map(argv.inbound.split(','), (t) => t.trim()) : [],
                                outbound: argv.outbound != '' ? _.map(argv.outbound.split(','), (t) => t.trim()) : []
                            }
                        },
                        webServer: {
                            port: argv.port
                        },
                        pdms: {
                            natsUri: argv.natsUri
                        }
                    }
                }
            }
        )

        .command(
            'producer',
            'Run as a producer client',
            (yargs) =>
                yargs
                    .option('logLevel', {
                        alias: 'l',
                        desc: 'The log level',
                        default: defaults.logger.level
                    })
                    .option('logFormat', {
                        alias: 'f',
                        desc: 'The log (`plainText` or `json`)',
                        type: 'string',
                        default: defaults.logger.transports.console.format
                    })
                    .option('uri', {
                        alias: 'u',
                        desc: 'The URI of the WebSocket server',
                        type: 'string',
                        default: 'http://localhost:8001'
                    })
                    .option('topic', {
                        alias: 't',
                        desc: 'The topic (event name) the message will be sent',
                        type: 'string',
                        default: 'message'
                    })
                    .option('message', {
                        alias: 'm',
                        desc: 'The JSON-format message string to send',
                        type: 'String',
                        default: null
                    })
                    .option('messageContent', {
                        alias: 'c',
                        desc: 'The file that contains the message content string to send',
                        type: 'String',
                        default: null
                    })
                    .option('scenario', {
                        alias: 's',
                        desc: 'The name of the YAML or JSON format scenario file that holds a list of messages to send',
                        type: 'String',
                        default: null
                    })
                    .option('dumpMessages', {
                        alias: 'd',
                        desc: 'Dump the complete messages list to send after loading',
                        type: 'boolean',
                        default: false
                    })
                    .option('rpc', {
                        alias: 'r',
                        desc: 'Do RPC-like, synchronous call through NATS',
                        type: 'boolean',
                        default: false
                    })
                    .demandOption([]),
            (argv) => {
                const channelType = getChannelType(argv.uri)
                results = {
                    command: {
                        name: 'producer',
                        type: 'async',
                        args: {
                            channelType: channelType,
                            uri: argv.uri,
                            topic: argv.topic,
                            message: argv.message != null && _.isString(argv.message) ? JSON.parse(argv.message) : null,
                            messageContent:
                                argv.messageContent != null && _.isString(argv.messageContent)
                                    ? path.resolve(argv.messageContent)
                                    : null,
                            scenario:
                                argv.scenario != null && _.isString(argv.scenario) ? path.resolve(argv.scenario) : null,
                            dumpMessages: argv.dumpMessages,
                            rpc: argv.rpc
                        }
                    },
                    cliConfig:
                        channelType === 'NATS'
                            ? {
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
                              }
                            : {
                                  logger: {
                                      level: argv.logLevel,
                                      transports: {
                                          console: {
                                              format: argv.logFormat
                                          }
                                      }
                                  }
                              }
                }
            }
        )

        .command(
            'consumer',
            'Run as a consumer client',
            (yargs) =>
                yargs
                    .option('logLevel', {
                        alias: 'l',
                        desc: 'The log level',
                        default: defaults.logger.level
                    })
                    .option('logFormat', {
                        alias: 'f',
                        desc: 'The log (`plainText` or `json`)',
                        type: 'string',
                        default: defaults.logger.transports.console.format
                    })
                    .option('uri', {
                        alias: 'u',
                        desc: 'The URI of the WebSocket server',
                        type: 'string',
                        default: 'http://localhost:8001'
                    })
                    .option('topic', {
                        alias: 't',
                        desc: 'The topic (event name) the message will be sent',
                        type: 'string',
                        default: 'message'
                    })
                    .demandOption([]),
            (argv) => {
                const channelType = getChannelType(argv.uri)
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
                    cliConfig:
                        channelType === 'NATS'
                            ? {
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
                              }
                            : {
                                  logger: {
                                      level: argv.logLevel,
                                      transports: {
                                          console: {
                                              format: argv.logFormat
                                          }
                                      }
                                  }
                              }
                }
            }
        )
        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse()

    return results
}

module.exports = {
    parse
}
