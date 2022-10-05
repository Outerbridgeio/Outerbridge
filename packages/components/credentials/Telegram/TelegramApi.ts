import { INodeParams, INodeCredential } from '../../src/Interface';

class TelegramApi implements INodeCredential {
    name: string;
    version: number;
    credentials: INodeParams[];

    constructor() {
        this.name = 'telegramApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Bot Token',
                name: 'botToken',
                type: 'string',
                default: 'eg: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHI',
                description:
                    '<s>Telegram bot token.<a target="_blank" href="https://www.youtube.com/watch?v=MZixi8oIdaA">Learn how to get it</a></s>'
            }
        ];
    }
}

module.exports = { credClass: TelegramApi };
