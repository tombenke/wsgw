#!/usr/bin/env node
/*jshint node: true */
'use strict'
import ioClient from 'socket.io-client'

/**
 * 'consumer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = (container, args, responseCb) => {
    container.logger.info(`${container.config.app.name} client ${JSON.stringify(args)}`)
    const serverUri = args.uri || `http://localhost:${container.config.wsServer.port}`
    const wsClient = ioClient(serverUri)

    wsClient.on(args.topic, data => {
        container.logger.info(`[${args.topic}] >> ${JSON.stringify(data)}`)
    })
}
