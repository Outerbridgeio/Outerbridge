import {
	INode, 
    INodeData, 
    INodeParams, 
    IProviders, 
    NodeType,
} from '../../src/Interface';
import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils';
import EventEmitter from 'events';
import Imap from 'imap';
import moment from 'moment';
import { simpleParser } from 'mailparser';

class EmailTrigger extends EventEmitter implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
	icon?: string;
    incoming: number;
	outgoing: number;
    credentials?: INodeParams[];
	providers: IProviders;

	constructor() {
		super();
		this.label = 'Email Trigger';
		this.name = 'emailTrigger';
		this.icon = 'email-trigger.svg';
		this.type = 'trigger';
		this.version = 1.0;
		this.description = 'Start workflow whenever a new email is received';
		this.incoming = 0;
		this.outgoing = 1;
		this.providers = {};
		this.credentials = [
			{
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Imap',
						name: 'imap',
					},
				],
				default: 'imap',
			},
		] as INodeParams[];
	};

	async runTrigger(nodeData: INodeData): Promise<void> {

		const credentials = nodeData.credentials;

        if (credentials === undefined) {
            throw new Error('Imap credentials missing');
        }

		let timeNow = new Date().getTime();

		const imap = new Imap({
			user: credentials.userEmail as string,
			password: credentials.password as string,
			host: credentials.host as string,
			port: credentials.port as number,
			tls: credentials.tls as boolean,
		});

		const openInbox = (cb: any) => {
			imap.openBox('INBOX', true, cb);
		}
		
		imap.once('ready', () => {

			openInbox((err: any, box: Imap.Box) => {
				if (err) throw handleErrorMessage(err);

				imap.on('mail', () => {
					try {
						imap.search([ 'NEW', ['SINCE', moment().format('MMMM D, YYYY')] ], (err, results) => {
							if (err) throw handleErrorMessage(err);

							if(!results || !results.length) {
								this.emit(emitEventKey, returnNodeExecutionData({ message: 'No new unread emails' }));
							}

							var f = imap.fetch(results, { bodies: '', markSeen: true });

							f.on('message', (msg: Imap.ImapMessage, seqno: number) => {

								msg.on('body', (stream) => {
									simpleParser(stream, (err, mail) => {
										if (err) throw handleErrorMessage(err);
										const returnData = {
											from: mail.headers.get('from'),
											to: mail.headers.get('to'),
											subject: mail.subject,
											date: mail.date,
											text: mail.text,
											htmlText: mail.textAsHtml,
											html: mail.html,
										} as any;

										if (mail.headers.has('cc')) returnData.cc = mail.headers.get('cc');
										if (mail.headers.has('bcc')) returnData.bcc = mail.headers.get('bcc');
										
										// Convert Buffer to base64 string
										if (mail.attachments && mail.attachments.length) {
											for (let i = 0; i < mail.attachments.length; i+=1) {
												(mail.attachments[i] as any).content = `data:${mail.attachments[i].contentType};base64,${mail.attachments[i].content.toString('base64')}`;
											}
											returnData.attachments = mail.attachments;
										}

										const emailDate = mail.date?.getTime();
										
										if (emailDate && timeNow < emailDate) {
											timeNow = emailDate;
											this.emit(emitEventKey, returnNodeExecutionData(returnData));
										}
									});
								});
							});

							f.once('error', (err) => {
								console.error('on mail error: ', err);
								throw new Error('Email Trigger Error: ' + err);
							});
						});
						
					} catch (err) {
						console.error(err);
						throw new Error('Email Trigger Error: ' + err);
					}
				});
			});
		});
		
		imap.once('error', (err: any) => {
			console.error('imap error = ', err);
			throw new Error('Email Trigger Error: ' + err);
		});
		
		imap.connect();

		const emitEventKey = nodeData.emitEventKey as string;

		this.providers[emitEventKey] = { provider: imap };
	}

	async removeTrigger(nodeData: INodeData): Promise<void> {
		const emitEventKey = nodeData.emitEventKey as string;
		
		if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
			const provider = this.providers[emitEventKey].provider;
			if (provider) provider.end();
			this.removeAllListeners(emitEventKey);
		}
	}
}

module.exports = { nodeClass: EmailTrigger }

