import _ from 'lodash'
import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import sinon from 'sinon'
import { expect } from 'chai'
import npac from 'npac'
import * as pdms from 'npac-pdms-hemera-adapter'
import appDefaults from './config'
import wsServer from './adapters/wsServer/'
import wsPdmsGw from './adapters/wsPdmsGw/'
import commands from './commands/'
import { start } from './index'
import { setupNatsLoopbacks } from './examples/natsLoopback.js'
import ioClient from 'socket.io-client'

/*
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'
*/
/*
const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    rimraf(dest, cb)
}
*/
describe('app', () => {
    let sandbox
/*
    before(function(done) {
        destCleanup(function() {
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
    })
*/
    const removeSignalHandlers = () => {
        const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
        for(const signal in signals) {
            process.removeAllListeners(signals[signal])
        }
    }

    beforeEach(done => {
        removeSignalHandlers()
        sandbox = sinon.sandbox.create({ useFakeTimers: false })
        done()
    })

    afterEach(done => {
        removeSignalHandlers()
        sandbox.restore()
        done()
    })

    const executeCommand = (args) => {
        return new Promise((resolve, reject) => {
            start(_.concat(['node', 'src/index.js'], args), (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('npac startup process and run jobs successfully finished')
                    resolve(res)
                }
            })
        })
    }

    const stopServer = () => {
        console.log('Send SIGTERM signal')
        process.kill(process.pid, 'SIGTERM')
    }

    it('#server, #producer - Loopback through NATS', (done) => {

        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        //const natsUri = 'nats:localhost:4222'
        const natsUri = "nats://demo.nats.io:4222"
        const wsServerUri = 'http://localhost:8001'

        setupNatsLoopbacks(natsUri, [['OUT1', 'IN1'], ['OUT2', 'IN2'], ['OUT2', 'IN3']])

        console.log('will start server')
        executeCommand([
            'server',
            '-f',
            '-n', natsUri,
            '-i', 'IN1,IN2,IN3', '-o', 'OUT1,OUT2'
        ]).then(() => {
            const wsClient = ioClient(wsServerUri)
            wsClient.on('IN1', data => {
                console.log(`[IN1] >> ${JSON.stringify(data)}`)
                console.log('will stop server')
                stopServer()
            })

            console.log('will execute producer')
            executeCommand([
                'producer',
                '-m', '{"topic": "OUT1", "payload": "Some payload"}'
                //'-s', 'src/commands/producer/fixtures/test_scenario.yml'
            ]).then(() => {
                console.log('Message sending completed')
            })
        })
    }).timeout(30000)
})
