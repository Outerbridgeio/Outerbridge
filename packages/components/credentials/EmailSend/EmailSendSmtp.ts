import {
    INodeParams, 
	INodeCredential,
} from '../../src/Interface';

class EmailSendSmtp implements INodeCredential {

	name: string;
    version: number;
    credentials: INodeParams[];

	constructor() {
		this.name = 'emailSendSmtp';
		this.version = 1.0;
		this.credentials = [
			{
				label: 'User',
				name: 'user',
				type: 'string',
				default: '',
			},
			{
				label: 'Password',
				name: 'password',
				type: 'string',
				default: '',
			},
			{
				label: 'Host',
				name: 'host',
				type: 'string',
				default: '',
			},
			{
				label: 'Port',
				name: 'port',
				type: 'number',
				default: 465,
			},
			{
				label: 'SSL/TLS',
				name: 'secure',
				type: 'boolean',
				default: true,
			},
		];
	}
}

module.exports = { credClass: EmailSendSmtp }