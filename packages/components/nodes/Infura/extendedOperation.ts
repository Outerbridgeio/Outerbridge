import { INodeOptionsValue, INodeParams } from '../../src'

export const IPFSOperationsOptions = [
    {
        label: 'add',
        name: 'add',
        description: 'Add a file or directory to IPFS.'
    },
    {
        label: 'get',
        name: 'get',
        description: 'Get IPFS objects.'
    },
    {
        label: 'block_get',
        name: 'block_get',
        description: 'Get a raw IPFS block.'
    },
    {
        label: 'block_put',
        name: 'block_put',
        description: 'Store input as an IPFS block.'
    },
    {
        label: 'block_stat',
        name: 'block_stat',
        description: 'Print information of a raw IPFS block.'
    },
    {
        label: 'cat',
        name: 'cat',
        description: 'Show IPFS object data. Same as get.'
    },
    {
        label: 'dag_get',
        name: 'dag_get',
        description: 'Get a dag node from IPFS.'
    },
    {
        label: 'dag_put',
        name: 'dag_put',
        description: 'Add a dag node to IPFS.'
    },
    {
        label: 'dag_resolve',
        name: 'dag_resolve',
        description: 'Resolve IPLD block.'
    },
    {
        label: 'object_data',
        name: 'object_data',
        description: 'Output the raw bytes of an IPFS object.'
    },
    {
        label: 'object_get',
        name: 'object_get',
        description: 'Get and serialize the DAG node named by key.'
    },
    {
        label: 'object_put',
        name: 'object_put',
        description: 'Store input as a DAG object, print its key.'
    },
    {
        label: 'object_stat',
        name: 'object_stat',
        description: 'Get stats for the DAG node named by key.'
    },
    {
        label: 'pin_add',
        name: 'pin_add',
        description: 'Pin objects to local storage.'
    },
    {
        label: 'pin_ls',
        name: 'pin_ls',
        description: 'Lists objects pinned to local storage.'
    },
    {
        label: 'pin_rm',
        name: 'pin_rm',
        description: 'Remove pinned objects from local storage.'
    }
] as INodeOptionsValue[]

export const fileParams = [
    {
        label: 'File',
        name: 'file',
        type: 'file',
        description: 'The path to a file to be added to IPFS.',
        show: {
            'inputParameters.operation': ['add', 'block_put', 'dag_put', 'pin_add']
        }
    }
] as INodeParams[]

export const argParams = [
    {
        label: 'Block Hash',
        name: 'arg',
        type: 'string',
        description: 'The base58 multihash of an existing block to get.',
        default: '',
        show: {
            'inputParameters.operation': ['block_get', 'block_stat']
        }
    }
] as INodeParams[]

export const catParams = [
    {
        label: 'IPFS Object Hash',
        name: 'arg',
        type: 'string',
        description: 'The IPFS object hash.',
        default: '',
        show: {
            'inputParameters.operation': ['cat']
        }
    }
] as INodeParams[]

export const dagParams = [
    {
        label: 'Dag Object',
        name: 'arg',
        type: 'string',
        description: 'The DAG object to get/resolve.',
        default: '',
        show: {
            'inputParameters.operation': ['dag_get', 'dag_resolve']
        }
    },
    {
        label: 'Output Codec',
        name: 'output-codec',
        type: 'string',
        description: 'Format the object will be decoded in. Default: dag-json.',
        optional: true,
        default: '',
        show: {
            'inputParameters.operation': ['dag_get']
        }
    },
    {
        label: 'Store Codec',
        name: 'store-codec',
        type: 'string',
        description: 'Codec that the stored object will be encoded with. Default: dag-cbor.',
        optional: true,
        default: '',
        show: {
            'inputParameters.operation': ['dag_put']
        }
    },
    {
        label: 'Input Codec',
        name: 'input-codec',
        type: 'string',
        description: 'Codec that the input object is encoded in. Default: dag-json.',
        optional: true,
        default: '',
        show: {
            'inputParameters.operation': ['dag_put']
        }
    },
    {
        label: 'Pin',
        name: 'pin',
        type: 'boolean',
        description: 'Pin this object when adding.',
        optional: true,
        default: true,
        show: {
            'inputParameters.operation': ['dag_put', 'object_put']
        }
    },
    {
        label: 'Hash',
        name: 'hash',
        type: 'string',
        description: 'Hash function to use. Default: sha2-256.',
        optional: true,
        default: '',
        show: {
            'inputParameters.operation': ['dag_put']
        }
    }
] as INodeParams[]

export const getParams = [
    {
        label: 'IPFS Object Hash',
        name: 'arg',
        type: 'string',
        description: 'The IPFS object hash.',
        default: '',
        show: {
            'inputParameters.operation': ['get']
        }
    }
    /*
    {
        label: 'Output',
        name: 'output',
        type: 'string',
        description: 'The path where the output should be stored.',
        default: '',
        optional: true,
        show: {
            'inputParameters.operation': [
                'get',
            ]
        }
    },
    {
        label: 'Archive',
        name: 'archive',
        type: 'boolean',
        description: 'Output a TAR archive.',
        optional: true,
        default: false,
        show: {
            'inputParameters.operation': [
                'get',
            ]
        }
    },
    {
        label: 'Compress',
        name: 'compress',
        type: 'boolean',
        description: 'Compress the output with GZIP compression.',
        optional: true,
        default: false,
        show: {
            'inputParameters.operation': [
                'get',
            ]
        }
    },
    {
        label: 'Compress Level',
        name: 'compression-level',
        type: 'number',
        description: 'The level of compression (1-9). Default: “-1”',
        optional: true,
        default: '',
        show: {
            'inputParameters.operation': [
                'get',
            ]
        }
    }
    */
] as INodeParams[]

export const objectParams = [
    {
        label: 'Object Key',
        name: 'arg',
        type: 'string',
        description: 'Key of the object to retrieve, in base58-encoded multihash format.',
        default: '',
        show: {
            'inputParameters.operation': ['object_data', 'object_get', 'object_stat']
        }
    },
    {
        label: 'File',
        name: 'file',
        type: 'file',
        description: 'The file to be stored as a DAG object.',
        show: {
            'inputParameters.operation': ['object_put']
        }
    },
    {
        label: 'Input Encoding',
        name: 'inputenc',
        type: 'options',
        description: 'Encoding type of input data.',
        options: [
            {
                label: 'Protobuf',
                name: 'protobuf'
            },
            {
                label: 'Json',
                name: 'json'
            }
        ],
        default: 'json',
        show: {
            'inputParameters.operation': ['object_put']
        }
    },
    {
        label: 'Data Field Encoding',
        name: 'datafieldenc',
        type: 'options',
        description: 'Encoding type of data field.',
        options: [
            {
                label: 'Text',
                name: 'text'
            },
            {
                label: 'Base64',
                name: 'base64'
            }
        ],
        default: 'text',
        show: {
            'inputParameters.operation': ['object_put']
        }
    }
] as INodeParams[]

export const pinParams = [
    {
        label: 'Object(s) Path',
        name: 'arg',
        type: 'string',
        description: 'Path to object(s) to be listed.',
        default: '',
        show: {
            'inputParameters.operation': ['pin_ls']
        }
    },
    {
        label: 'Object(s) Path',
        name: 'arg',
        type: 'string',
        description: 'Path to object(s) to be unpinned.',
        default: '',
        show: {
            'inputParameters.operation': ['pin_rm']
        }
    },
    {
        label: 'Object(s) Path',
        name: 'arg',
        type: 'string',
        description: 'Path to object(s) to be pinned.',
        default: '',
        show: {
            'inputParameters.operation': ['pin_add']
        }
    },
    {
        label: 'Type',
        name: 'inputenc',
        type: 'options',
        description: 'The type of pinned keys to list.',
        options: [
            {
                label: 'Direct',
                name: 'direct'
            },
            {
                label: 'Indirect',
                name: 'indirect'
            },
            {
                label: 'Recursive',
                name: 'recursive'
            },
            {
                label: 'All',
                name: 'all'
            }
        ],
        default: 'all',
        show: {
            'inputParameters.operation': ['pin_ls']
        }
    }
] as INodeParams[]
