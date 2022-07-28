import "reflect-metadata"
import { DataSource } from "typeorm"
import { Workflow } from "./entity/Workflow"
import { Execution } from "./entity/Execution"
import { Credential } from "./entity/Credential"
import { Webhook } from "./entity/Webhook"
import { Contract } from "./entity/Contract"
import { Wallet } from "./entity/Wallet"

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "outerbridge",
    synchronize: true,
    logging: false,
    entities: [Workflow, Execution, Credential, Webhook, Contract, Wallet],
    migrations: [],
    subscribers: [],
})
