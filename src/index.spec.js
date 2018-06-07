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

/*
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'
*/

//import { start } from './index'

const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    rimraf(dest, cb)
}

describe('app', () => {
    let sandbox

    before(function(done) {
        destCleanup(function() {
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
    })

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

    it('#start, #stop', (done) => {

        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const config = _.merge({}, appDefaults, pdms.defaults, { /* Add command specific config parameters */ })
        /*
        const processArgv = [
            'node', 'src/index.js'
        ]
        */
        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.startup,
            wsServer.startup,
            wsPdmsGw.startup
            // TODO: Add BL adapter
        ]

        const terminators = [
            wsPdmsGw.shutdown,
            wsServer.shutdown,
            pdms.shutdown
        ]

        const testModule = (container, next) => {
            container.logger.info(`Run job to test the module`)
            // TODO: Implement endpoint testing
            next(null, {})
        }

        npac.start(adapters, [testModule], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    }).timeout(10000)
})
