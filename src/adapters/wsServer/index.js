#!/usr/bin/env node
/*jshint node: true */
'use strict';

import http from 'http'
import SocketIo from 'socket.io'
import defaults from './config'
import _ from 'lodash'

/**
 * The startup function of the adapter
 *
 * This function should be registered with the startup phase, then npac will call when the project is starting.
 *
 * @arg {Object} container  - The actual state of the container this adapter will be added
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the wsServer adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
const startup = (container, next) => {
    // Merges the defaults with the config coming from the outer world
    const serviceConfig = _.merge({}, defaults, { wsServer: container.config.wsServer || {} })
    container.logger.info('Start up wsServer adapter')
    container.logger.info(`wsServer.config: ${JSON.stringify(serviceConfig)}`)

    const httpServer = http.createServer()
    const io = SocketIo(httpServer)

    io.on('connection', function (socket) {
        container.logger.info('Client connected')
        socket.on('message', function (data) {
            const targetEv = serviceConfig.wsServer.forwardTopics ? data.topic : 'message'
            container.logger.info(`[message] >> ${JSON.stringify(data)} >> [${targetEv}]`)
            socket.broadcast.emit(targetEv, data)
        })
    })
    io.on('error', function (err) {
        container.logger.error('Server ERROR:', err)
    })
    io.on('disconnection', reason => {
        container.logger.info('Server DISCONNECTION:', reason)
    })

    httpServer.listen(serviceConfig.wsServer.port)
    // Call next setup function with the context extension
    next(null, {
        config: serviceConfig,
        wsServer: {
            server: io
        }
    })
}

/**
 * The shutdown function of the service adapter
 *
 * This function should be registered with the shutdown phase, then npac will call when graceful shutdown happens.
 *
 * @arg {Object} container  - The actual state of the container this adapter is running
 * @arg {Function} next     - Error-first callback function to pass the result partial container extended with the wsServer adapter.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
const shutdown = (container, next) => {
    container.logger.info("Shut down wsServer adapter")
    container.wsServer.server.close((err) => next(err, null))
}

module.exports = {
    defaults: defaults,
    startup: startup,
    shutdown: shutdown
}
