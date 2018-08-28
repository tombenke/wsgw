'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitMessageNats = exports.finishWithErrorNats = exports.finishWithSuccessNats = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var finishWithSuccessNats = exports.finishWithSuccessNats = function finishWithSuccessNats(container, endCb) {
    return function () {
        container.logger.info('Successfully completed.');
        endCb(null, null);
        // NATS will be closed by the container
    };
};
var finishWithErrorNats = exports.finishWithErrorNats = function finishWithErrorNats(container, endCb) {
    return function (err) {
        container.logger.error('ERROR: ' + err + '!');
        endCb(err, null);
        // NATS will be closed by the container
    };
};

var emitMessageNats = exports.emitMessageNats = function emitMessageNats(container) {
    return function (topic, message) {
        return new Promise(function (resolve, reject) {
            // Send to the message specific topic if defined, otherwise sent to the globally defined topic
            var topicToSend = _lodash2.default.get(message, 'topic', topic);
            container.pdms.act(_lodash2.default.merge({}, message, { 'pubsub$': true, topic: topicToSend }));
            container.logger.info(JSON.stringify(message) + ' >> [' + topicToSend + ']');
            resolve(message);
        });
    };
};