import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

import { IWallet } from '../Interface'

@Entity()
export class Wallet implements IWallet {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    network: string

    @Column('text', { nullable: true })
    providerCredential: string

    @Column()
    walletCredential: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
