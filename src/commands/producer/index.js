#!/usr/bin/env node
/*jshint node: true */
'use strict'
import ioClient from 'socket.io-client'

/**
 * 'producer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = (container, args) => {
    container.logger.info(`${container.config.app.name} client ${JSON.stringify(args)}`)
    const serverUri = args.uri || `http://localhost:${container.config.wsServer.port}`
    const wsClient = ioClient(serverUri)

    container.logger.info(`${JSON.stringify(args.message)} >> [${args.topic}]`)
    wsClient.emit(args.topic, args.message, confirmation => {
        container.logger.info(`Got confirmation: ${confirmation}`)
        wsClient.close()
    })
}
