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

var emitMessageNats = exports.emitMessageNats = function emitMessageNats(container, rpc) {
    return function (topic, message) {
        var strToEmit = _lodash2.default.isString(message) ? message : JSON.stringify(message);
        return new Promise(function (resolve, reject) {
            if (rpc) {
                container.pdms.request(topic, strToEmit, function (response) {
                    console.log(JSON.stringify(response, null, '  '));
                    resolve(response);
                });
            } else {
                container.pdms.publish(topic, strToEmit);
                container.logger.info(strToEmit + ' >> [' + topic + ']');
                resolve(message);
            }
        });
    };
};