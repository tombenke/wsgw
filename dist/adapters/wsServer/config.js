'use strict';

/**
 * The default configuration for the wsServer adapter
 */
module.exports = {
    wsServer: {
        forwarderEvent: process.env.WSGW_SERVER_FORWARDER_EVENT || 'message',
        forwardTopics: process.env.WSGW_SERVER_FORWARD_TOPICS || false,
        port: process.env.WSGW_SERVER_PORT || 8001
    }
};