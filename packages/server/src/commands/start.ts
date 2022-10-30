import { Command } from '@oclif/core'
import path from 'path'
import * as Server from '../index'
import * as DataSource from '../DataSource'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

enum EXIT_CODE {
    SUCCESS = 0,
    FAILED = 1
}
let processExitCode = EXIT_CODE.SUCCESS

export default class Start extends Command {
    static flags = {}

    static args = []

    static async stopProcess() {
        console.info('Shutting down Outerbridge...')
        try {
            // Shut down the app after timeout if it ever stuck removing pools
            setTimeout(() => {
                console.info('Outerbridge was forced to shut down after 30 secs')
                process.exit(processExitCode)
            }, 30000)

            // Removing pools
            const serverApp = Server.getInstance()
            if (serverApp) await serverApp.stopApp()
        } catch (error) {
            console.error('There was an error shutting down Outerbridge...', error)
        }
        process.exit(processExitCode)
    }

    async run(): Promise<void> {
        process.on('SIGTERM', Start.stopProcess)
        process.on('SIGINT', Start.stopProcess)

        // Prevent throw new Error from crashing the app
        // TODO: Get rid of this and send proper error message to ui
        process.on('uncaughtException', (err) => {
            console.error('uncaughtException: ', err)
        })

        await (async () => {
            try {
                this.log('Starting Outerbridge...')
                await DataSource.init()
                await Server.start()
            } catch (error) {
                console.error('There was an error starting Outerbridge...', error)
                processExitCode = EXIT_CODE.FAILED
                // @ts-ignore
                process.emit('SIGINT')
            }
        })()
    }
}
