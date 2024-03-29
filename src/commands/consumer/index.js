#!/usr/bin/env node
/*jshint node: true */
'use strict'
import ioClient from 'socket.io-client'

/**
 * 'consumer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 * @arg {Function} responseCb - Callback function
 *
 * @function
 */
exports.execute = (container, args, responseCb) => {
    container.logger.info(`${container.config.app.name} client ${JSON.stringify(args)}`)
    const serverUri = args.uri || `http://localhost:${container.config.wsServer.port}`

    if (args.channelType === 'NATS') {
        container.logger.info(`Start listening to messages on NATS "${args.topic}" topic`)
        container.pdms.subscribe(args.topic, (data) => {
            container.logger.info(`NATS[${args.topic}] >> ${JSON.stringify(data)}\n`)
        })
    } else {
        container.logger.info(`Start listening to messages on WebSocket "${args.topic}" topic`)
        const wsClient = ioClient(serverUri)

        wsClient.on(args.topic, (data) => {
            container.logger.info(`WS[${args.topic}] >> ${JSON.stringify(data)}\n`)
        })
    }
}
