"use strict";

/**
 * The default configuration for the wsServer adapter
 */
module.exports = {
    wsServer: {
        forwardTopics: process.env.WSGW_SERVER_FORWARD_TOPICS || false,
        port: process.env.WSGW_SERVER_PORT || 8001
    }
};