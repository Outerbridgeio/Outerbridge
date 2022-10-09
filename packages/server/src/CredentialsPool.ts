import { INodeCredential } from 'outerbridge-components'

import { IComponentCredentialsPool } from './Interface'

import path from 'path'
import { Dirent } from 'fs'
import { getNodeModulesPackagePath } from './utils'
import { promises } from 'fs'

export class CredentialsPool {
    componentCredentials: IComponentCredentialsPool = {}

    /**
     * Initialize to get all credentials
     */
    async initialize() {
        const packagePath = getNodeModulesPackagePath('outerbridge-components')
        const credPath = path.join(packagePath, 'dist', 'credentials')
        const credFiles = await this.getFiles(credPath)
        return Promise.all(
            credFiles.map(async (file) => {
                if (file.endsWith('.js')) {
                    const credModule = await import(file)
                    const newCredInstance: INodeCredential = new credModule.credClass()
                    this.componentCredentials[newCredInstance.name] = newCredInstance
                }
            })
        )
    }

    /**
     * Recursive function to get credential files
     * @param {string} dir
     * @returns {string[]}
     */
    async getFiles(dir: string): Promise<string[]> {
        const dirents = await promises.readdir(dir, { withFileTypes: true })
        const files = await Promise.all(
            dirents.map((dirent: Dirent) => {
                const res = path.resolve(dir, dirent.name)
                return dirent.isDirectory() ? this.getFiles(res) : res
            })
        )
        return Array.prototype.concat(...files)
    }
}
