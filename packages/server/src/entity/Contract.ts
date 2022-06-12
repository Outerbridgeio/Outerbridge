import { 
    Entity, 
    Column, 
    ObjectIdColumn, 
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { ObjectId } from 'mongodb';

import {
    IContract,
} from '../Interface';

@Entity()
export class Contract implements IContract {

	@ObjectIdColumn()
    _id: ObjectId;

	@Column()
	name: string;

	@Column('text', { nullable: true })
	abi: string;

	@Column('text', { nullable: true, unique: true })
	address: string;

	@Column()
	network: string;

	@CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
