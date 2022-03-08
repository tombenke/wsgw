import _ from 'lodash'
import path from 'path'
import { interval, from, pipe } from 'rxjs'
import { tap, map, mergeMap, delayWhen, scan } from 'rxjs/operators'
import { loadJsonFileSync } from 'datafile'
import { getWsClient, emitMessageWs, finishWithErrorWs, finishWithSuccessWs } from './ws'
import { emitMessageNats, finishWithErrorNats, finishWithSuccessNats } from './nats'

export const loadMessagesFromScenarioFile = (container, topic, scenarioFileName) => {
    container.logger.debug(`loadMessagesFromScenarioFile(scenarioFileName: "${scenarioFileName}")`)
    let messages = []
    if (!_.isString(scenarioFileName) || scenarioFileName === '') {
        return messages
    }
    const scenario = loadJsonFileSync(path.resolve(scenarioFileName))

    if (_.isArray(scenario)) {
        const basePath = path.dirname(scenarioFileName)
        messages = _.chain(scenario)
            .flatMap((item) =>
                _.has(item, 'scenario')
                    ? loadMessagesFromScenarioFile(container, topic, path.resolve(basePath, item.scenario))
                    : _.has(item, 'file')
                    ? loadMessageContentFromFile(container, item.delay, item.topic, path.resolve(basePath, item.file))
                    : item
            )
            .value()
            .map((item) => ({
                delay: _.get(item, 'delay', 0),
                topic: _.get(item, 'topic', topic),
                message: _.get(item, 'message', {})
            }))
    }

    return messages
}

export const loadMessageContentFromFile = (container, delay, topic, messageFileName) => {
    container.logger.debug(`loadMessageContentFromFile(messageFileName: "${messageFileName}")`)
    let messages = []
    if (!_.isString(messageFileName)) {
        return messages
    }
    const content = loadJsonFileSync(path.resolve(messageFileName))
    messages = [{ delay: delay, topic: topic, message: content }]
    return messages
}

const getMessagesToPublish = (container, args) => {
    const directMessage = args.message != null ? [{ delay: 0, topic: args.topic, message: args.message }] : []
    const messagesToPublish = _.concat(
        directMessage,
        loadMessageContentFromFile(container, 0, args.topic, args.messageContent),
        loadMessagesFromScenarioFile(container, args.topic, args.scenario)
    )
    if (args.dumpMessages) {
        container.logger.info(`Messages to publish: ${JSON.stringify(messagesToPublish, null, '  ')}`)
    }

    return messagesToPublish
}

const publishMessages = (messages, topic, emitMessageFun) =>
    new Promise((resolve, reject) => {
        from(messages)
            .pipe(
                scan((accu, message) => _.merge({}, message, { delay: accu.delay + message.delay }), { delay: 0 }),
                delayWhen((message) => interval(message.delay)),
                mergeMap((message) => emitMessageFun(topic, message.message))
            )
            .subscribe(
                (message) => {
                    /*console.log(message)*/
                },
                (err) => reject(err),
                () => resolve()
            )
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
    container.logger.debug(`${container.config.app.name} client ${JSON.stringify(args)}`)
    const serverUri = args.uri || `http://localhost:${container.config.wsServer.port}`
    const messagesToPublish = getMessagesToPublish(container, args)

    if (args.channelType === 'NATS') {
        container.logger.debug('It sends messages through NATS')
        publishMessages(messagesToPublish, args.topic, emitMessageNats(container, args.rpc))
            .then(finishWithSuccessNats(container, endCb))
            .catch(finishWithErrorNats(container, endCb))
    } else {
        container.logger.debug('It sends messages through websocket')
        const wsClient = getWsClient(serverUri)
        publishMessages(messagesToPublish, args.topic, emitMessageWs(container, wsClient))
            .then(finishWithSuccessWs(container, wsClient, endCb))
            .catch(finishWithErrorWs(container, wsClient, endCb))
    }
}
