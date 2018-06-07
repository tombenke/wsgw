#!/usr/bin/env node

/*jshint node: true */
'use strict';

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
                    forwardTopics: argv.forward
                },
                pdms: {
                    natsUri: argv.natsUri
                }
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