import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Workflow } from './entity/Workflow'
import { Execution } from './entity/Execution'
import { Credential } from './entity/Credential'
import { Webhook } from './entity/Webhook'
import { Contract } from './entity/Contract'
import { Wallet } from './entity/Wallet'

let appDataSource: DataSource

export async function init(): Promise<void> {
    appDataSource = new DataSource({
        type: 'mongodb',
        url: process.env.MONGO_URL || `mongodb://${process.env.MONGO_HOST || 'localhost'}:27017/outerbridge`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: true,
        logging: false,
        entities: [Workflow, Execution, Credential, Webhook, Contract, Wallet],
        migrations: [],
        subscribers: []
    })
}

export function getDataSource(): DataSource {
    if (appDataSource === undefined) {
        init()
    }
    return appDataSource
}
