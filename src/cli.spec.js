import _ from 'lodash'
import { expect } from 'chai'
import appDefaults from './config'
import pdms from 'npac-pdms-hemera-adapter'
import { wsServer, wsPdmsGw } from 'npac-wsgw-adapters'
import webServer from './adapters/webServer/'
import cli from './cli'

before((done) => {
    done()
})

after((done) => {
    done()
})

describe('cli', () => {
    const defaults = _.merge({}, appDefaults, pdms.defaults, webServer.defaults, wsServer.defaults, wsPdmsGw.defaults)

    it('#parse - server command with defaults', (done) => {
        const processArgv = ['node', 'src/index.js', 'server']
        const expected = {
            command: {
                name: 'server',
                type: 'async',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                wsServer: {
                    forwardTopics: false,
                    forwarderEvent: 'message'
                },
                webServer: {
                    port: 8001
                },
                wsPdmsGw: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                pdms: {
                    natsUri: 'nats://localhost:4222'
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('#parse - server command with full list of args', (done) => {
        const processArgv = [
            'node',
            'src/index.js',
            'server',
            '-c',
            'config.yml',
            '-f',
            '-e',
            'fwd$',
            '-i',
            'IN1,IN2, IN3',
            '-o',
            'OUT1, OUT2 ,OUT3',
            '-n',
            'nats://localhost:4222',
            '-p',
            '8002'
        ]
        const expected = {
            command: {
                name: 'server',
                type: 'async',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                wsServer: {
                    forwardTopics: true,
                    forwarderEvent: 'fwd$'
                },
                webServer: {
                    port: 8002
                },
                wsPdmsGw: {
                    topics: {
                        inbound: ['IN1', 'IN2', 'IN3'],
                        outbound: ['OUT1', 'OUT2', 'OUT3']
                    }
                },
                pdms: {
                    natsUri: 'nats://localhost:4222'
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('#parse consumer command with defaults', (done) => {
        const processArgv = ['node', 'src/index.js', 'consumer']
        const expected = {
            command: {
                name: 'consumer',
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'message',
                    uri: 'http://localhost:8001'
                }
            },
            cliConfig: {
                configFileName: 'config.yml'
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('#parse consumer command with full list of args', (done) => {
        const processArgv = [
            'node',
            'src/index.js',
            'consumer',
            '-c',
            'config.yml',
            '-u',
            'wss://ws.mydomain.com:1234',
            '-t',
            'MY_TOPIC'
        ]
        const expected = {
            command: {
                name: 'consumer',
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'MY_TOPIC',
                    uri: 'wss://ws.mydomain.com:1234'
                }
            },
            cliConfig: {
                configFileName: 'config.yml'
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('#parse producer command with defaults', (done) => {
        const processArgv = ['node', 'src/index.js', 'producer']
        const expected = {
            command: {
                name: 'producer',
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'message',
                    uri: 'http://localhost:8001',
                    message: null,
                    source: null,
                    dumpMessages: false,
                    rpc: false
                }
            },
            cliConfig: {
                configFileName: 'config.yml'
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('#parse producer command with full list of args', (done) => {
        const processArgv = [
            'node',
            'src/index.js',
            'producer',
            '-c',
            'config.yml',
            '-u',
            'wss://ws.mydomain.com:1234',
            '-t',
            'MY_TOPIC',
            '-m',
            '{ "topic": "MY_TOPIC", "payload": "Some payload..."}',
            '-s',
            '/fixtures/test_scenario.yml',
            '-d',
            '-r'
        ]
        const expected = {
            command: {
                name: 'producer',
                type: 'async',
                args: {
                    channelType: 'WS',
                    topic: 'MY_TOPIC',
                    uri: 'wss://ws.mydomain.com:1234',
                    message: { topic: 'MY_TOPIC', payload: 'Some payload...' },
                    source: '/fixtures/test_scenario.yml',
                    dumpMessages: true,
                    rpc: true
                }
            },
            cliConfig: {
                configFileName: 'config.yml'
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
