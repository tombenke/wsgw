import _ from 'lodash'
import path from 'path'
import ioClient from 'socket.io-client'
import { interval, from, pipe } from 'rxjs'
import { tap, map, mergeMap, delayWhen, scan } from 'rxjs/operators'
import { loadJsonFileSync } from 'datafile'

const loadMessageFile = (hostFileName, messageFileName) =>
    loadJsonFileSync(path.resolve(path.dirname(hostFileName), messageFileName))

export const loadMessagesFromFile = fileName => {
    let messages = []
    const content = loadJsonFileSync(fileName, false)

    // If this is a single message, then make a messages array from it
    if (_.isArray(content)) {
        messages = content
    } else if (_.isObject(content) && _.has(content, ['topic']) && _.has(content, ['payload'])) {
        messages = [{ delay: 0, message: content }]
    }

    return _.chain(messages)
        .flatMap(item =>
            _.chain(_.concat(_.get(item, 'message', []), _.has(item, 'file') ? loadMessageFile(fileName, item.file) : []))
                .map(message => ({ delay: _.get(item, 'delay', 0), message: message}))
                .value())
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
    const messagesToPublish = _.concat(directMessage, loadMessagesFromFile(args.source))
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
