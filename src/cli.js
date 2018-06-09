import _ from 'lodash'
import path from 'path'

const yargs = require('yargs')

const parse = (defaults, processArgv=process.argv) => {
    let results = {}

    yargs(processArgv.slice(2))
        .command('server', 'Run in server mode', yargs =>
            yargs
                .option("config", {
                    alias: "c",
                    desc: "The name of the configuration file",
                    default: defaults.configFileName
                })
                .option("port", {
                    alias: "p",
                    desc: "The webSocket server port",
                    type: 'number',
                    default: defaults.wsServer.port
                })
                .option("forward", {
                    alias: "f",
                    desc: "Forwards messages among inbound and outbound topics",
                    type: 'boolean',
                    default: defaults.wsServer.forwardTopics
                })
                .option("inbound", {
                    alias: "i",
                    desc: "Comma separated list of inbound NATS topics to forward through websocket",
                    type: 'string',
                    default: ""
                })
                .option("outbound", {
                    alias: "o",
                    desc: "Comma separated list of outbound NATS topics to forward towards from websocket",
                    type: 'string',
                    default: ""
                })
                .option("natsUri", {
                    alias: "n",
                    desc: "NATS server URI used by the pdms adapter.",
                    type: 'string',
                    default: defaults.pdms.natsUri
                })
                .demandOption([]),
            argv => {
                results = {
                    command: {
                        name: 'server',
                        args: {},
                    },
                    cliConfig: {
                        configFileName: argv.config,
                        wsServer: {
                            forwardTopics: argv.forward,
                            port: argv.port
                        },
                        wsPdmsGw: {
                            topics: {
                                inbound: argv.inbound != "" ? _.map(argv.inbound.split(','), t => t.trim()) : [],
                                outbound: argv.outbound != "" ? _.map(argv.outbound.split(','), t => t.trim()) : []
                            }
                        },
                        pdms: {
                            natsUri: argv.natsUri
                        }
                    }
                }
            }
        )

        .command('producer', 'Run as a producer client', yargs =>
            yargs
                .option("config", {
                    alias: "c",
                    desc: "The name of the configuration file",
                    default: defaults.configFileName
                })
                .option("uri", {
                    alias: "u",
                    desc: "The URI of the WebSocket server",
                    type: 'string',
                    default: "http://localhost:8001"
                })
                .option("topic", {
                    alias: "t",
                    desc: "The topic (event name) the message will be sent",
                    type: 'string',
                    default: "message"
                })
                .option("message", {
                    alias: "m",
                    desc: "The JSON-format message string to send",
                    type: 'String',
                    default: null
                })
                .option("source", {
                    alias: "s",
                    desc: "The name of the YAML or JSON format source file that holds the messages to send",
                    type: 'String',
                    default: null
                })
                .demandOption([]),
            argv => {
                results = {
                    command: {
                        name: 'producer',
                        args: {
                            uri: argv.uri,
                            topic: argv.topic,
                            message: (argv.message != null && _.isString(argv.message)) ? JSON.parse(argv.message) : null,
                            source: (argv.source != null && _.isString(argv.source)) ? path.resolve(argv.source) : null
                        },
                    },
                    cliConfig: {
                        configFileName: argv.config
                    }
                }
            }
        )

        .command('consumer', 'Run as a consumer client', yargs =>
            yargs
                .option("config", {
                    alias: "c",
                    desc: "The name of the configuration file",
                    default: defaults.configFileName
                })
                .option("uri", {
                    alias: "u",
                    desc: "The URI of the WebSocket server",
                    type: 'string',
                    default: "http://localhost:8001"
                })
                .option("topic", {
                    alias: "t",
                    desc: "The topic (event name) the message will be sent",
                    type: 'string',
                    default: "message"
                })
                .demandOption([]),
            argv => {
                results = {
                    command: {
                        name: 'consumer',
                        args: {
                            uri: argv.uri,
                            topic: argv.topic
                        },
                    },
                    cliConfig: {
                        configFileName: argv.config
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
