/* eslint-disable */
import { Entity, Column, ObjectIdColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { ICredential } from '../Interface'

@Entity()
export class Credential implements ICredential {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Index()
    @Column()
    nodeCredentialName: string

    @Column()
    credentialData: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
