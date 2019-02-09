#!/usr/bin/env node
/*jshint node: true */
'use strict'

import _ from 'lodash'
import { wsServer, wsPdmsGw } from 'npac-wsgw-adapters'
import pdms from 'npac-pdms-hemera-adapter'
import webServer from './adapters/webServer/'
import appDefaults from './config'
import commands from './commands/'
import cli from './cli'
import npac from 'npac'

const callCommand = command => (command.type === 'sync' ? npac.makeCallSync(command) : npac.makeCall(command))

export const start = (argv = process.argv, cb = null) => {
    const defaults = _.merge({}, appDefaults, pdms.defaults, webServer.defaults, wsServer.defaults, wsPdmsGw.defaults)

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig, command } = cli.parse(defaults, argv)
    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = [callCommand(command)]
    // Define the adapters and executives to add to the container
    const appAdapters =
        command.name === 'server'
            ? [
                  npac.mergeConfig(config),
                  npac.addLogger,
                  pdms.startup,
                  webServer.startup,
                  wsServer.startup,
                  wsPdmsGw.startup,
                  commands
              ]
            : command.args.channelType === 'NATS'
            ? [npac.mergeConfig(config), npac.addLogger, pdms.startup, commands]
            : [npac.mergeConfig(config), npac.addLogger, commands]

    const appTerminators =
        command.name === 'server'
            ? [wsPdmsGw.shutdown, wsServer.shutdown, webServer.shutdown, pdms.shutdown]
            : command.args.channelType === 'NATS'
            ? [pdms.shutdown]
            : []

    //Start the container
    console.log(command, appTerminators, jobs)
    npac.start(appAdapters, jobs, appTerminators, (err, res) => {
        //        if (command.name !== 'server') {
        process.kill(process.pid, 'SIGTERM')
        //        }
    })
}
