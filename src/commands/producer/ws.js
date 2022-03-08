import ioClient from 'socket.io-client'
import _ from 'lodash'

export const getWsClient = (serverUri) => ioClient(serverUri)

export const finishWithSuccessWs = (container, wsClient, endCb) => () => {
    container.logger.info(`Successfully completed.`)
    wsClient.close()
    endCb(null, null)
}
export const finishWithErrorWs = (container, wsClient, endCb) => (err) => {
    container.logger.error(`ERROR: ${err}!`)
    wsClient.close()
    endCb(err, null)
}

export const emitMessageWs = (container, wsClient) => (topic, message) => {
    return new Promise((resolve, reject) => {
        const strToEmit = _.isString(message) ? message : JSON.stringify(message)
        container.logger.info(`${strToEmit} >> [${topic}]`)
        wsClient.emit(topic, strToEmit, (confirmation) => {
            container.logger.debug(`Got confirmation: ${confirmation}`)
            resolve(message)
        })
    })
}
