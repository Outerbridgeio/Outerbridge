import {
	INodeCredential, 
} from "outerbridge-components";

import {
    IComponentCredentialsPool,
} from './Interface';

import path from 'path';
import { Dirent } from "fs";
const { readdir } = require('fs').promises;

export class CredentialsPool {

    componentCredentials: IComponentCredentialsPool = {};

    /**
	 * Initialize to get all credentials
	 */
    async initialize() {
	
		const credPath = path.join(__dirname, "..", "node_modules", "outerbridge-components", "dist", "credentials");
        const credFiles = await this.getFiles(credPath);
        credFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const credModule = require(file);
                const newCredInstance: INodeCredential = new credModule.credClass();
                this.componentCredentials[newCredInstance.name] = newCredInstance;
            }
        });
	}

    
    /**
     * Recursive function to get credential files
     * @param {string} dir
     * @returns {string[]}
     */
    async getFiles(dir: string): Promise<string[]> {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent: Dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getFiles(res) : res;
        }));
        return Array.prototype.concat(...files);
    }
}