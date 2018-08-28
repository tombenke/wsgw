import ioClient from 'socket.io-client'

export const getWsClient = serverUri => ioClient(serverUri)
    
export const finishWithSuccessWs = (container, wsClient, endCb) => () => {
    container.logger.info(`Successfully completed.`)
    wsClient.close()
    endCb(null, null)
}
export const finishWithErrorWs = (container, wsClient, endCb) => err => {
    container.logger.error(`ERROR: ${err}!`)
    wsClient.close()
    endCb(err, null)
}

export const emitMessageWs = (container, wsClient) => (topic, message) => {
    return new Promise((resolve, reject) => {
        container.logger.info(`${JSON.stringify(message)} >> [${topic}]`)
        wsClient.emit(topic, message, confirmation => {
            container.logger.debug(`Got confirmation: ${confirmation}`)
            resolve(message)
        })
    })
}
