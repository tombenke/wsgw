#!/usr/bin/env node
/*jshint node: true */
'use strict';

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
                            forwardTopics: argv.forward
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
                    default: "{}"
                })
                .option("source", {
                    alias: "s",
                    desc: "The name of the YAML or JSON format source file that holds the messages to send",
                    type: 'String',
                    default: "messages.yml"
                })
                .demandOption([]),
            argv => {
                results = {
                    command: {
                        name: 'producer',
                        args: {
                            uri: argv.uri,
                            topic: argv.topic,
                            message: JSON.parse(argv.message),
                            source: argv.source
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
}

module.exports = {
    parse
}
