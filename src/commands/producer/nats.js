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
    return new Promise((resolve, reject) => {
        // Send to the message specific topic if defined, otherwise sent to the globally defined topic
        const topicToSend = _.get(message, 'topic', topic)
        /*
        if (rpc) {
            const fullMsgToSend = _.merge({}, message, { pubsub$: false, topic: topicToSend })
            container.logger.info(`${JSON.stringify(message)} >> [${topicToSend}]`)
            container.pdms.act(fullMsgToSend, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(JSON.stringify(res, null, '  '))
                    resolve(res)
                }
            })
        } else {
            const fullMsgToSend = _.merge({}, message, { pubsub$: true, topic: topicToSend })
            container.pdms.act(fullMsgToSend)
            container.logger.info(`${JSON.stringify(message)} >> [${topicToSend}]`)
            resolve(message)
        }
        */
        if (rpc) {
            container.pdms.request(topic, JSON.stringify(message), (response) => {
                console.log(JSON.stringify(response, null, '  '))
                resolve(response)
            })
        } else {
            container.pdms.publish(topic, JSON.stringify(message))
            container.logger.info(`${JSON.stringify(message)} >> [${topicToSend}]`)
            resolve(message)
        }
    })
}
