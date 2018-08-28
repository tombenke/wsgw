import _ from 'lodash'
import path from 'path'
import { interval, from, pipe } from 'rxjs'
import { tap, map, mergeMap, delayWhen, scan } from 'rxjs/operators'
import { loadJsonFileSync } from 'datafile'
import { getWsClient, emitMessageWs, finishWithErrorWs, finishWithSuccessWs } from './ws'
import { emitMessageNats, finishWithErrorNats, finishWithSuccessNats } from './nats'

export const loadMessagesFromFile = (container, hostFileName, messageFileName, delay = 0) => {
    container.logger.info(`loadMessagesFromFile("${hostFileName}", "${messageFileName}", delay=${delay})`)
    let messages = []
    if (! _.isString(hostFileName) || ! _.isString(messageFileName)) {
        return messages
    }
    const content = loadJsonFileSync(path.resolve(path.dirname(hostFileName), path.basename(messageFileName)), false)

    // If this is a single message, then make a messages array from it
    if (_.isArray(content)) {
        const firstItem = _.head(content)
        if (_.has(firstItem, 'message')) {
            const firstMessage = { ...firstItem, delay: delay + _.get(firstItem, 'delay', 0) }
            messages = _.concat(firstMessage, _.tail(content))
        } else {
            messages = content
        }
    } else if (_.isObject(content) && _.has(content, ['topic']) && _.has(content, ['payload'])) {
        messages = [{ delay: delay, message: content }]
    }

    return _.chain(messages)
        .flatMap(item =>
            _.has(item, 'file') ? loadMessagesFromFile(container, hostFileName, item.file, _.get(item, 'delay', 0)) : item)
        .value()
        .map(item => ({ delay: _.get(item, 'delay', 0), message: _.get(item, 'message', {})}))
}

const getMessagesToPublish = (container, args) => {
    const directMessage = args.message != null ? [{ delay: 0, message: args.message }] : []
    const messagesToPublish = _.concat(directMessage, loadMessagesFromFile(container, args.source, args.source, 0))
    if (args.dumpMessages) {
        container.logger.info(`${JSON.stringify(messagesToPublish, null, '  ')}`)
    }

    return messagesToPublish
}

const publishMessages = (messages, topic, emitMessageFun) => new Promise((resolve, reject) => {
    from(messages).pipe(
        scan((accu, message) => _.merge({}, message, { delay: accu.delay + message.delay }), { delay: 0 }),
        delayWhen(message => interval(message.delay)),
        mergeMap(message => emitMessageFun(topic, message.message))
    ).subscribe((message) => { console.log(message)}, err => reject(err), () => resolve())
})

/**
 * 'producer' command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.execute = (container, args, endCb) => {
    container.logger.info(`${container.config.app.name} client ${JSON.stringify(args)}`)
    const serverUri = args.uri || `http://localhost:${container.config.wsServer.port}`
    const messagesToPublish = getMessagesToPublish(container, args)

    if (args.channelType === 'NATS') {
        container.logger.info('It sends messages through NATS')
        publishMessages(messagesToPublish, args.topic, emitMessageNats(container))
            .then(finishWithSuccessNats(container, endCb))
            .catch(finishWithErrorNats(container, endCb))
    } else {
        container.logger.info('It sends messages through websocket')
        const wsClient = getWsClient(serverUri)
        publishMessages(messagesToPublish, args.topic, emitMessageWs(container, wsClient))
            .then(finishWithSuccessWs(container, wsClient, endCb))
            .catch(finishWithErrorWs(container, wsClient, endCb))
    }
}
