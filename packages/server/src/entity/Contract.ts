/* eslint-disable */
import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { IContract } from '../Interface'

@Entity()
export class Contract implements IContract {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    abi: string

    @Column()
    address: string

    @Column()
    network: string

    @Column('text', { nullable: true })
    providerCredential: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
