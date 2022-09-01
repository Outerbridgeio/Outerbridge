import {
	Column,
	Entity,
	Index,
	ObjectIdColumn,
	CreateDateColumn,
    UpdateDateColumn,
	PrimaryColumn
} from 'typeorm';
import { ObjectId } from 'mongodb';

import {
	IWebhook,
	WebhookMethod,
 } from '../Interface';

@Entity()
export class Webhook implements IWebhook {

	@ObjectIdColumn()
    _id: ObjectId;

	@Column()
	nodeId: string;

	@Index()
	@PrimaryColumn()
	webhookEndpoint: string;

	@Index()
	@PrimaryColumn()
	httpMethod: WebhookMethod;

	@Column()
	workflowShortId: string;

	@Column({ nullable: true })
	webhookId: string;

	@CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
