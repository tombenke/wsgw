import * as server from './server/'
import * as producer from './producer/'
import * as consumer from './consumer/'

module.exports = {
    server: server.execute,
    producer: producer.execute,
    consumer: consumer.execute
}
