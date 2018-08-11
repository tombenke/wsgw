import _ from 'lodash'
import path from 'path'
import ioClient from 'socket.io-client'
import { interval, from, pipe } from 'rxjs'
import { tap, map, mergeMap, delayWhen, scan } from 'rxjs/operators'
import { loadJsonFileSync } from 'datafile'

export const loadMessagesFromFile = (hostFileName, messageFileName, delay = 0) => {
    console.log(`loadMessagesFromFile(${hostFileName},${messageFileName},${delay})`)
    let messages = []
    if (! _.isString(hostFileName) || ! _.isString(messageFileName)) {
        return messages
    }
    const content = loadJsonFileSync(path.resolve(path.dirname(hostFileName), path.basename(messageFileName)), false)

    // If this is a single message, then make a messages array from it
    if (_.isArray(content)) {
        messages = content
    } else if (_.isObject(content) && _.has(content, ['topic']) && _.has(content, ['payload'])) {
        messages = [{ delay: delay, message: content }]
    }

    return _.chain(messages)
        .flatMap(item =>
                _.has(item, 'file') ? loadMessagesFromFile(hostFileName, item.file, _.get(item, 'delay', 0)) : item)
        .value()
}

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

    const directMessage = args.message != null ? [{ delay: 0, message: args.message }] : []
    const messagesToPublish = _.concat(directMessage, loadMessagesFromFile(args.source, args.source, 0))
    const finishWithSuccess = () => {
        container.logger.info(`Successfully completed.`)
        wsClient.close()
    }
    const finishWithError = err => {
        container.logger.error(`ERROR: ${err}!`)
        wsClient.close()
    }

    from(messagesToPublish).pipe(
        scan((accu, message) => _.merge({}, message, { delay: accu.delay + message.delay }), { delay: 0 }),
        delayWhen(message => interval(message.delay)),
        mergeMap(message => {
            return new Promise((resolve, reject) => {
                wsClient.emit(args.topic, message.message, confirmation => {
                    container.logger.debug(`Got confirmation: ${confirmation}`)
                    container.logger.info(`${JSON.stringify(message.message)} >> [${args.topic}]`)
                    resolve(message)
                })
            })
        })
    ).subscribe((message) => { console.log(message)}, finishWithError, finishWithSuccess)
}
