import path from 'path'
import thisPackage from '../package.json'
/**
 * The default configuration:
 *
 *  {
 *      app: {
 *          name: {String},             // The name of the generator tool
 *          version: {String}           // The version of the generator tool
 *      },
 *      configFileName: {String},       // The name of the config file '.rest-tool.yml',
 *      logLevel: {String},             // The log level: (info | warn | error | debug)
 */
module.exports = {
    app: {
        name: thisPackage.name,
        version: thisPackage.version
    },
    configFileName: 'config.yml',
    logger: {
        level: process.env.WSGW_LOG_LEVEL || 'info',
        transports: {
            console: {
                format: process.env.WSGW_LOG_FORMAT || 'plainText' // 'plainText' or 'json'
            }
        }
    },
    installDir: path.resolve('./')
}
