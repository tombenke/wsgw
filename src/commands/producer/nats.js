import _ from 'lodash'

export const finishWithSuccessNats = (container, endCb) => () => {
    container.logger.info(`Successfully completed.`)
    endCb(null, null)
    // NATS will be closed by the container
}
export const finishWithErrorNats = (container, endCb) => (err) => {
    container.logger.error(`ERROR: ${err}!`)
    endCb(err, null)
    // NATS will be closed by the container
}

export const emitMessageNats = (container, rpc) => (topic, message) => {
    const strToEmit = _.isString(message) ? message : JSON.stringify(message)
    return new Promise((resolve, reject) => {
        if (rpc) {
            container.pdms.request(topic, strToEmit, (response) => {
                console.log(JSON.stringify(response, null, '  '))
                resolve(response)
            })
        } else {
            container.pdms.publish(topic, strToEmit)
            container.logger.info(`${strToEmit} >> [${topic}]`)
            resolve(message)
        }
    })
}
