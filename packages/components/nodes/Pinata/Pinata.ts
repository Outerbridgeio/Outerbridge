import { ICommonObject, INode, INodeData, INodeExecutionData, INodeParams, NodeType } from '../../src/Interface'
import { handleErrorMessage, returnNodeExecutionData, serializeQueryParams } from '../../src/utils'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'
import FormData from 'form-data'

class Pinata implements INode {
    label: string
    name: string
    type: NodeType
    description: string
    version: number
    icon: string
    incoming: number
    outgoing: number
    actions?: INodeParams[]
    credentials?: INodeParams[]
    inputParameters?: INodeParams[]

    constructor() {
        this.label = 'Pinata'
        this.name = 'pinata'
        this.icon = 'pinata.svg'
        this.type = 'action'
        this.version = 1.0
        this.description = 'Pin your content to IPFS with Pinata'
        this.incoming = 1
        this.outgoing = 1
        this.actions = [
            {
                label: 'Select Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'JSON',
                        name: 'json'
                    },
                    {
                        label: 'Multiple JSON',
                        name: 'multipleJson',
                        description: 'Wrap each json from an array into a json file (0.json, 1.json..) and store under a directory'
                    },
                    {
                        label: 'File',
                        name: 'file'
                    },
                    {
                        label: 'Folder',
                        name: 'folder'
                    },
                    {
                        label: 'CID (Content Identifier)',
                        name: 'CID'
                    },
                    {
                        label: 'Raw Data (Base64)',
                        name: 'base64',
                        description: 'Wrap the raw data in base64 format into a file and store under a directory'
                    },
                    {
                        label: 'Multiple Raw Data (Base64)',
                        name: 'multipleBase64',
                        description:
                            'Wrap each raw data in base64 format from an array into a file (0.png, 1.pdf..) and store under a directory'
                    },
                    {
                        label: 'List Pin By CID Jobs',
                        name: 'listPin'
                    },
                    {
                        label: 'Update Metadata',
                        name: 'updateMetadata'
                    },
                    {
                        label: 'Remove Files (Unpin)',
                        name: 'unpin'
                    }
                ],
                description: 'Content type to be pinned'
            },
            {
                label: 'JSON Content',
                name: 'jsonContent',
                type: 'json',
                placeholder: '{"var1": "value1"}',
                description: 'The content of JSON to be pinned.',
                show: {
                    'actions.operation': ['json']
                }
            },
            {
                label: 'JSON Content In Array',
                name: 'jsonContentArray',
                type: 'json',
                placeholder: '[ {"var1": "value1"}, {"var2": "value2"} ]',
                description: 'An array with multiple json objects to be pinned.',
                show: {
                    'actions.operation': ['multipleJson']
                }
            },
            {
                label: 'Raw Data Content (Base64)',
                name: 'base64Content',
                type: 'string',
                placeholder: 'data:image/png;base64,<base64_string>',
                description: 'Raw data content in base64 format to be pinned. Commonly used with image, pdf',
                show: {
                    'actions.operation': ['base64']
                }
            },
            {
                label: 'Raw Data Content In Array (Base64)',
                name: 'base64ContentArray',
                type: 'json',
                placeholder: '[ "data:image/png;base64,<base64_string>", "data:application/pdf;base64,<base64_string>" ]',
                description: 'An array with multiple raw data content in base64 format to be pinned. Commonly used with image, pdf',
                show: {
                    'actions.operation': ['multipleBase64']
                }
            },
            {
                label: 'File',
                name: 'fileContent',
                type: 'file',
                description: 'The path to a file to be pinned.',
                show: {
                    'actions.operation': ['file']
                }
            },
            {
                label: 'Folder',
                name: 'folderContent',
                type: 'folder',
                description: 'The path to a folder to be pinned.',
                show: {
                    'actions.operation': ['folder']
                }
            },
            {
                label: 'Hash To Pin (CID)',
                name: 'hashToPin',
                type: 'string',
                description:
                    'A CID (or content identifier) is a hash generated by the IPFS protocol and representative of a piece of content.',
                show: {
                    'actions.operation': ['CID']
                },
                placeholder: 'Qmc5TDt1jynbZGvLiGnJvLh9RqB4uxVUg4vgMAcPqwpEiy'
            },
            {
                label: 'IPFS Pin Hash (CID)',
                name: 'ipfsPinHash',
                type: 'string',
                description:
                    'A CID (or content identifier) is a hash generated by the IPFS protocol and representative of a piece of content.',
                show: {
                    'actions.operation': ['updateMetadata']
                },
                placeholder: 'Qmc5TDt1jynbZGvLiGnJvLh9RqB4uxVUg4vgMAcPqwpEiy'
            },
            {
                label: 'Pin To Delete (CID)',
                name: 'pinToDelete',
                type: 'string',
                description:
                    'A CID (or content identifier) is a hash generated by the IPFS protocol and representative of a piece of content.',
                show: {
                    'actions.operation': ['unpin']
                },
                placeholder: 'Qmc5TDt1jynbZGvLiGnJvLh9RqB4uxVUg4vgMAcPqwpEiy'
            }
        ] as INodeParams[]
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Pinata API Key',
                        name: 'pinataApi'
                    }
                ],
                default: 'pinataApi'
            }
        ] as INodeParams[]
        this.inputParameters = [
            {
                label: 'CID Version',
                name: 'cidVersion',
                type: 'options',
                options: [
                    {
                        label: '0 (CIDv0)',
                        name: '0'
                    },
                    {
                        label: '1 (CIDv1)',
                        name: '1'
                    }
                ],
                optional: true,
                description: 'The CID Version IPFS will use when creating a hash for your content.',
                show: {
                    'actions.operation': ['json', 'multipleJson', 'base64', 'multipleBase64', 'file', 'folder', 'CID']
                }
            },
            {
                label: 'Wrap With Directory',
                name: 'wrapWithDirectory',
                type: 'boolean',
                default: false,
                optional: true,
                description:
                    'Wrap your content inside of a directory when adding to IPFS. This allows users to retrieve content via a filename instead of just a hash.',
                show: {
                    'actions.operation': ['json', 'base64', 'file', 'folder', 'CID']
                }
            },
            {
                label: 'Metadata Name',
                name: 'name',
                type: 'string',
                default: '',
                optional: true,
                description: `A custom name. If you don't provide this value, it will automatically be populated by the original name of the file you've uploaded.`,
                show: {
                    'actions.operation': ['json', 'multipleJson', 'base64', 'multipleBase64', 'file', 'folder', 'CID', 'updateMetadata']
                }
            },
            {
                label: 'Metadata KeyValues',
                name: 'keyvalues',
                type: 'json',
                placeholder: '{"var1": "value1"}',
                optional: true,
                description: `The key values object allows for users to provide any custom key / value pairs they want for the file being uploaded.`,
                show: {
                    'actions.operation': ['json', 'multipleJson', 'base64', 'multipleBase64', 'file', 'folder', 'CID', 'updateMetadata']
                }
            },
            {
                label: 'Host Nodes',
                name: 'hostNodes',
                type: 'json',
                placeholder: '["0xa", "0xb"]',
                optional: true,
                description: `Multiaddresses of nodes your content is already stored on. Max 5 nodes.`,
                show: {
                    'actions.operation': ['CID']
                }
            },
            {
                label: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    {
                        label: 'Prechecking',
                        name: 'prechecking',
                        description: 'Pinata is running preliminary validations on your pin request.'
                    },
                    {
                        label: 'Searching',
                        name: 'searching',
                        description:
                            'Pinata is actively searching for your content on the IPFS network. This may take some time if your content is isolated.'
                    },
                    {
                        label: 'Retrieving',
                        name: 'retrieving',
                        description: 'Pinata has located your content and is now in the process of retrieving it.'
                    },
                    {
                        label: 'Expired',
                        name: 'expired',
                        description: `Pinata wasn't able to find your content after a day of searching the IPFS network. Please make sure your content is hosted on the IPFS network before trying to pin again.`
                    },
                    {
                        label: 'Over Free Limit',
                        name: 'over_free_limit',
                        description:
                            'Pinning this object would put you over the free tier limit. Please add a credit card to continue pinning content.'
                    },
                    {
                        label: 'Over Max Size',
                        name: 'over_max_size',
                        description: `This object is too large of an item to pin. If you're seeing this, please contact us for a more custom solution.`
                    },
                    {
                        label: 'Invalid Object',
                        name: 'invalid_object',
                        description: `The object you're attempting to pin isn't readable by IPFS nodes. Please contact us if you receive this, as we'd like to better understand what you're attempting to pin.`
                    },
                    {
                        label: 'Bad Host Node',
                        name: 'bad_host_node',
                        description:
                            'You provided a host node that was either invalid or unreachable. Please make sure all provided host nodes are online and reachable.'
                    }
                ],
                description: `Filter by the status of the job in the pinning queue.`,
                show: {
                    'actions.operation': ['listPin']
                }
            }
        ]
    }

    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
        const actionData = nodeData.actions
        const inputParametersData = nodeData.inputParameters
        const credentials = nodeData.credentials

        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing')
        }

        const operation = actionData.operation as string

        const apiKey = credentials.apiKey as string
        const secretKey = credentials.secretKey as string

        const cidVersion = inputParametersData.cidVersion as string
        const wrapWithDirectory = inputParametersData.wrapWithDirectory as boolean
        const name = inputParametersData.name as string
        const keyvalues = inputParametersData.keyvalues as string
        const hostNodes = inputParametersData.hostNodes as string

        const returnData: ICommonObject[] = []
        let responseData: any

        let url = ''
        const queryParameters: ICommonObject = {}
        let queryBody: any = {}
        let method: Method = 'POST'
        const headers: AxiosRequestHeaders = {
            'Content-Type': 'application/json',
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretKey
        }

        function getOptionsAndMetadata() {
            // Metadata
            const pinataMetadataObj: ICommonObject = {}
            if (name) pinataMetadataObj.name = name
            if (keyvalues) {
                const parsedKeyValues = JSON.parse(keyvalues.replace(/\s/g, ''))
                pinataMetadataObj.keyvalues = parsedKeyValues
            }
            if (Object.keys(pinataMetadataObj).length > 0) {
                queryBody.pinataMetadata = pinataMetadataObj
            }

            // Options
            const pinataOptionsObj: ICommonObject = {}
            if (cidVersion) pinataOptionsObj.cidVersion = parseInt(cidVersion)
            if (wrapWithDirectory) pinataOptionsObj.wrapWithDirectory = wrapWithDirectory
            if (hostNodes) {
                const hostNodesArray = JSON.parse(hostNodes.replace(/\s/g, ''))
                if (hostNodesArray.length) pinataOptionsObj.hostNodes = hostNodesArray
            }
            if (Object.keys(pinataOptionsObj).length > 0) {
                queryBody.pinataOptions = pinataOptionsObj
            }
        }

        try {
            if (operation === 'json') {
                // Json Content
                const jsonContent_str = actionData.jsonContent as string

                if (wrapWithDirectory) {
                    url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
                    const jsonContent_base64 = Buffer.from(jsonContent_str).toString('base64')

                    const filename = name ? `${name}.json` : `0.json`
                    const bf = Buffer.from(jsonContent_base64, 'base64')

                    const formData = new FormData()
                    formData.append('file', bf, filename)

                    getOptionsAndMetadata()

                    headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                    if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                        formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                    if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                        formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                    queryBody = formData
                } else {
                    url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'

                    const parsedInputJson = JSON.parse(jsonContent_str.replace(/\s/g, ''))
                    queryBody.pinataContent = parsedInputJson

                    getOptionsAndMetadata()
                }
            } else if (operation === 'multipleJson') {
                // Json Content Array
                const jsonContentArray_str = actionData.jsonContentArray as string
                const jsonContentArray = JSON.parse(jsonContentArray_str)

                url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

                const formData = new FormData()
                for (let i = 0; i < jsonContentArray.length; i += 1) {
                    const jsonContent_base64 = Buffer.from(JSON.stringify(jsonContentArray[i])).toString('base64')
                    const filename = `${i}.json`
                    const bf = Buffer.from(jsonContent_base64, 'base64')
                    const foldername = name ? name : `MultipleJsonFolder`
                    formData.append('file', bf, { filepath: `${foldername}/${filename}` })
                }

                getOptionsAndMetadata()

                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                    formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                    formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                queryBody = formData
            } else if (operation === 'base64') {
                // Base64 Content
                const base64Content_str = actionData.base64Content as string
                //base64Content_str = data:image/png;base64,<base64_string>

                url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

                const splitDataURI = base64Content_str.split(',')

                const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
                const extension = splitDataURI.pop()?.split(';')[0].split('/')[1]

                const filename = name ? `${name}.${extension}` : `0.${extension}`

                const formData = new FormData()
                formData.append('file', bf, filename)

                getOptionsAndMetadata()

                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                    formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                    formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                queryBody = formData
            } else if (operation === 'multipleBase64') {
                // Base64 Content Array
                const base64ContentArray_str = actionData.base64ContentArray as string
                const base64ContentArray = JSON.parse(base64ContentArray_str)

                url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

                const formData = new FormData()
                for (let i = 0; i < base64ContentArray.length; i += 1) {
                    const splitDataURI = base64ContentArray[i].split(',')
                    const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
                    const extension = splitDataURI.pop()?.split(';')[0].split('/')[1]
                    const filename = `${i}.${extension}`
                    const foldername = name ? name : `MultipleRawDataFolder`
                    formData.append('file', bf, { filepath: `${foldername}/${filename}` })
                }

                getOptionsAndMetadata()

                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                    formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                    formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                queryBody = formData
            } else if (operation === 'file') {
                url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

                const fileBase64 = actionData.fileContent as string
                const splitDataURI = fileBase64.split(',')

                const filename = (splitDataURI.pop() || 'filename:').split(':')[1]
                const bf = Buffer.from(splitDataURI.pop() || '', 'base64')

                const formData = new FormData()
                formData.append('file', bf, filename)

                getOptionsAndMetadata()

                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                    formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                    formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                queryBody = formData
            } else if (operation === 'folder') {
                url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

                const folderContent = actionData.folderContent as string
                const base64Array = JSON.parse(folderContent.replace(/\s/g, ''))

                const formData = new FormData()
                for (let i = 0; i < base64Array.length; i += 1) {
                    const fileBase64 = base64Array[i]
                    const splitDataURI = fileBase64.split(',')

                    const filepath = (splitDataURI.pop() || 'filepath:').split(':')[1]
                    const bf = Buffer.from(splitDataURI.pop() || '', 'base64')
                    formData.append('file', bf, { filepath })
                }

                getOptionsAndMetadata()

                headers['Content-Type'] = 'multipart/form-data; boundary=' + formData.getBoundary()
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataOptions'))
                    formData.append('pinataOptions', JSON.stringify(queryBody.pinataOptions))
                if (Object.prototype.hasOwnProperty.call(queryBody, 'pinataMetadata'))
                    formData.append('pinataMetadata', JSON.stringify(queryBody.pinataMetadata))

                queryBody = formData
            } else if (operation === 'CID') {
                url = 'https://api.pinata.cloud/pinning/pinByHash'

                const hashToPin = actionData.hashToPin as string
                queryBody.hashToPin = hashToPin

                getOptionsAndMetadata()
            } else if (operation === 'listPin') {
                url = 'https://api.pinata.cloud/pinning/pinJobs'
                method = 'GET'

                const status = inputParametersData.status as string
                queryParameters.status = status
                queryParameters.sort = 'ASC'
            } else if (operation === 'updateMetadata') {
                url = 'https://api.pinata.cloud/pinning/hashMetadata'
                method = 'PUT'

                const ipfsPinHash = actionData.ipfsPinHash as string
                queryBody.ipfsPinHash = ipfsPinHash

                if (name) queryBody.name = name
                if (keyvalues) {
                    const parsedKeyValues = JSON.parse(keyvalues.replace(/\s/g, ''))
                    queryBody.keyvalues = parsedKeyValues
                }
            } else if (operation === 'unpin') {
                const pinToDelete = actionData.pinToDelete as string
                url = `https://api.pinata.cloud/pinning/unpin/${pinToDelete}`
                method = 'DELETE'
            }

            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                headers
            }

            if (Object.keys(queryParameters).length > 0) {
                axiosConfig.params = queryParameters
                axiosConfig.paramsSerializer = (params) => serializeQueryParams(params)
            }

            if (Object.keys(queryBody).length > 0) {
                axiosConfig.data = queryBody
            }

            const response = await axios(axiosConfig)
            responseData = response.data
        } catch (error) {
            throw handleErrorMessage(error)
        }

        if (Array.isArray(responseData)) returnData.push(...responseData)
        else returnData.push(responseData)

        return returnNodeExecutionData(returnData)
    }
}

module.exports = { nodeClass: Pinata }
