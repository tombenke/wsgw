import _ from 'lodash'
import { expect } from 'chai'
import appDefaults from './config'
import pdms from 'npac-pdms-hemera-adapter'
import wsPdmsGw from './adapters/wsPdmsGw/'
import wsServer from './adapters/wsServer/'
import cli from './cli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('cli', () => {
    const defaults = _.merge({}, appDefaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)

    it('parse', done => {
        const processArgv = [
            'node', 'src/index.js', 'server'
        ]
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: false
                },
                pdms: {
                    natsUri: "nats://demo.nats.io:4222"
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('parse with NATS URI', done => {
        const processArgv = [
            'node', 'src/index.js',
            'server',
            '-c', 'config.yml',
            '-n', 'nats://localhost:4222'
        ]
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                wsServer: {
                    forwardTopics: false
                },
                pdms: {
                    natsUri: "nats://localhost:4222"
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
