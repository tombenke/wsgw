#!/usr/bin/env node
/*jshint node: true */
'use strict';

import _ from 'lodash'
import pdms from 'npac-pdms-hemera-adapter'
import wsServer from './adapters/wsServer/'
import wsPdmsGw from './adapters/wsPdmsGw/'
import appDefaults from './config'
import commands from './commands/'
import cli from './cli'
import npac from 'npac'

export const start = (argv=process.argv, cb=null) => {

    const defaults = _.merge({}, appDefaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig, command } = cli.parse(defaults, argv)
    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = [npac.makeCallSync(command)]

    // Define the adapters and executives to add to the container
    const appAdapters = command.name === 'server' ? [
        npac.mergeConfig(config),
        npac.addLogger,
        pdms.startup,
        wsServer.startup,
        wsPdmsGw.startup,
        commands
    ] : [
        npac.mergeConfig(config),
        npac.addLogger,
        commands
    ]

    const appTerminators = command.name === 'server' ? [
        wsPdmsGw.shutdown,
        wsServer.shutdown,
        pdms.shutdown
    ] : []

    //Start the container
    npac.start(appAdapters, jobs, appTerminators, cb)
}
