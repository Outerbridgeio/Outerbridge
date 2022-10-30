import { Entity, Column, ObjectIdColumn, Index, BeforeInsert, CreateDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

import { shortId } from '../utils'

import { IExecution, ExecutionState } from '../Interface'

@Entity()
export class Execution implements IExecution {
    @ObjectIdColumn()
    _id: ObjectId

    @Index()
    @Column()
    shortId: string

    @BeforeInsert()
    beforeInsert() {
        this.shortId = shortId('E', new Date())
    }

    @Column()
    executionData: string

    @Column()
    state: ExecutionState

    @Column()
    workflowShortId: string

    @CreateDateColumn()
    createdDate: Date

    @Column({ nullable: true })
    stoppedDate: Date
}
