import { 
    Entity, 
    Column, 
    ObjectIdColumn, 
    Index, 
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { ObjectId } from 'mongodb';

import {
	shortId,
} from '../utils';

import {
	IWorkflow,
} from '../Interface';

@Entity()
export class Workflow implements IWorkflow {

    @ObjectIdColumn()
    _id: ObjectId;

    @Index()
    @Column()
   	shortId: string;

	@BeforeInsert()
	beforeInsert() {
		this.shortId = shortId('W', new Date());
	}

    @Column()
	name: string;

    @Column()
	flowData: string;

    @Column()
	deployed: boolean;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
