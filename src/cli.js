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
