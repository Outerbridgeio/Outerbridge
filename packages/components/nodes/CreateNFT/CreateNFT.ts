import {
    ICommonObject,
	IDbCollection,
	INode, 
    INodeData, 
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams, 
    IWallet, 
    NodeType,
} from '../../src/Interface';
import {
    getNodeModulesPackagePath,
	handleErrorMessage,
    returnNodeExecutionData
} from '../../src/utils';
import { ethers } from "ethers";
import * as fs from 'fs';
import { 
    ArbitrumNetworks,
    BSCNetworks,
    ETHNetworks,
    getNetworkProvider, 
    getNetworkProvidersList, 
    NETWORK, 
    networkExplorers, 
    NETWORK_PROVIDER,
    openseaExplorers,
    OptimismNetworks,
    PolygonNetworks, 
} from '../../src/ChainNetwork';

const solc = require('solc');

class CreateNFT implements INode {

    label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    networks?: INodeParams[];
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'Create NFT';
		this.name = 'createNFT';
		this.icon = 'createNFT.png';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Create new NFT';
        this.incoming = 1;
        this.outgoing = 1;
		this.networks = [
			{
				label: 'Network',
				name: 'network',
				type: 'options',
				options: [
					...ETHNetworks,
                    ...PolygonNetworks,
                    ...ArbitrumNetworks,
                    ...OptimismNetworks,
                    ...BSCNetworks
				],
				default: 'goerli',
			},
			{
				label: 'Network Provider',
				name: 'networkProvider',
				type: 'asyncOptions',
				loadMethod: 'getNetworkProviders',
			},
			{
				label: 'RPC Endpoint',
				name: 'jsonRPC',
				type: 'string',
				default: '',
				show: {
					'networks.networkProvider': ['customRPC']
				}
			},
			{
				label: 'Websocket Endpoint',
				name: 'websocketRPC',
				type: 'string',
				default: '',
				show: {
					'networks.networkProvider': ['customWebsocket']
				}
			},
		] as INodeParams[];
		this.credentials = [
			{
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Alchemy API Key',
						name: 'alchemyApi',
						show: {
							'networks.networkProvider': ['alchemy']
						}
					},
					{
						label: 'Infura API Key',
						name: 'infuraApi',
						show: {
							'networks.networkProvider': ['infura']
						}
					},
				],
				default: '',
				show: {
					'networks.networkProvider': ['infura', 'alchemy']
				}
			},
		] as INodeParams[];
		this.inputParameters = [
            {
				label: 'Select Wallet',
				name: 'wallet',
				type: 'asyncOptions',
                description: 'Wallet account to create NFT.',
				loadFromDbCollections: ['Wallet'],
				loadMethod: 'getWallets',
			},
			{
				label: 'NFT Name',
				name: 'nftName',
				type: 'string',
				default: '',
				placeholder: 'MyNFT',
			},
			{
				label: 'NFT Supply',
				name: 'nftSupply',
				type: 'number',
				default: 1,
				description: 'Initialy supply of the NFT'
			},
            {
				label: 'NFT Metadata',
				name: 'nftMetadata',
				type: 'options',
                options: [
                    {
                        label: 'Ipfs Hash/Pin',
                        name: 'ipfsHash',
                        description: 'Ipfs hash/pin of the folder that contains the json metadata files'
                    },
                    {
                        label: 'URL',
                        name: 'url',
                        description: 'URL of the folder that contains the json metadata files. Ex: https://ipfs.io/ipfs/QmSPiKckfBDhw1pXdjHvU4jndN5pn4ZbKHeA9Nnn622C7U',
                    },
                ],
				description: 'Fetch metadata from a url OR using Ipfs hash/pin'
			},
            {
				label: 'NFT Metadata URL',
				name: 'nftMetadataJsonUrl',
				type: 'string',
				placeholder: 'https://ipfs.io/ipfs/QmSPiKckfBDhw1pXdjHvU4jndN5pn4ZbKHeA9Nnn622C7U',
				description: 'URL of the folder that contains the json metadata files',
                show: {
                    'inputParameters.nftMetadata': ['url']
                }
			},
            {
				label: 'NFT Metadata Ipfs Hash/Pin',
				name: 'nftMetadataHash',
				type: 'string',
				placeholder: 'QmexuwvmmtwsazQ7LK93SyVdFeYRnDbjET414y2xXiToM4',
				description: 'Ipfs hash/pin of the folder that contains the json metadata files',
                show: {
                    'inputParameters.nftMetadata': ['ipfsHash']
                }
			},
            {
				label: 'Collection Name',
				name: 'collectionName',
				type: 'string',
				default: '',
				placeholder: 'MyCollection',
			},
            {
				label: 'Solidity Version',
				name: 'solidityVersion',
				type: 'options',
                description: 'Soldity version to compile code for NFT creation',
                options: [
                    {
                        label: '0.8.10',
                        name: '0.8.10'
                    },
                    {
                        label: '0.8.11',
                        name: '0.8.11'
                    },
                    {
                        label: '0.8.12',
                        name: '0.8.12'
                    },
                    {
                        label: '0.8.13',
                        name: '0.8.13'
                    },
                    {
                        label: '0.8.14',
                        name: '0.8.14'
                    },
                    {
                        label: '0.8.15',
                        name: '0.8.15'
                    }
                ],
				default: '0.8.15',
			},
		] as INodeParams[];
	};

    loadMethods = {

		async getWallets(nodeData: INodeData, dbCollection?: IDbCollection): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) {
                return returnData;
            }

			try {
				if (dbCollection === undefined || !dbCollection || !dbCollection.Wallet) {
					return returnData;
				}

				const wallets: IWallet[] = dbCollection.Wallet;

				for (let i = 0; i < wallets.length; i+=1) {
					const wallet = wallets[i];
					const data = {
						label: `${wallet.name} (${wallet.network})`,
						name: JSON.stringify(wallet),
						description: wallet.address
					} as INodeOptionsValue;
					returnData.push(data);
				}

				return returnData;

			} catch(e) {
				return returnData;
			}
		},

        async getNetworkProviders(nodeData: INodeData): Promise<INodeOptionsValue[]> {
			const returnData: INodeOptionsValue[] = [];

			const networksData = nodeData.networks;
            if (networksData === undefined) return returnData;

			const network = networksData.network as NETWORK;
			return getNetworkProvidersList(network);
		},

    }

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const networksData = nodeData.networks;
		const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;

        if (networksData === undefined || inputParametersData === undefined) {
            throw new Error('Required data missing');
        }

        try {
            const walletString = inputParametersData.wallet as string;
			const walletDetails: IWallet = JSON.parse(walletString);
			const network = networksData.network as NETWORK;

            const provider = await getNetworkProvider(
				networksData.networkProvider as NETWORK_PROVIDER,
				network,
				credentials,
				networksData.jsonRPC as string,
				networksData.websocketRPC as string,
			)

			if (!provider) throw new Error('Invalid Network Provider');

            // Get wallet instance
            const walletCredential = JSON.parse(walletDetails.walletCredential);
            const wallet = new ethers.Wallet(walletCredential.privateKey as string, provider);

            const nftName = inputParametersData.nftName as string;
            const collectionName = inputParametersData.collectionName as string;
            const nftMetadataJsonUrl = inputParametersData.nftMetadataJsonUrl as string;
            const nftMetadataHash = inputParametersData.nftMetadataHash as string;
            const nftSupply = inputParametersData.nftSupply as number;
            const solidityVersion = inputParametersData.solidityVersion as string;

            const input = {
                language: 'Solidity',
                sources: {},
                settings: {
                    outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                    }
                }
            } as any;
    
            function findImports(_path: any) {
                const filepath = getNodeModulesPackagePath(_path);
                const contents = fs.readFileSync(filepath).toString();
                return { contents }
            }
    
            let metadata = '';
            if (nftMetadataJsonUrl) {
                metadata = `${nftMetadataJsonUrl}/{id}.json`;
            } else if (nftMetadataHash) {
                metadata = `ipfs://${nftMetadataHash}/{id}.json`;
            }

            let encodePacked = '';
            if (metadata) {
                encodePacked = metadata.substring(0, metadata.lastIndexOf("/") + 1);
            }

            const nftContractName = nftName.replace(/\s/g, "");
            const tokenId = 0;

            const contractCode = 
            `// SPDX-License-Identifier: MIT
            pragma solidity ^${solidityVersion};
            
            import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
            import "@openzeppelin/contracts/access/Ownable.sol";
            import "@openzeppelin/contracts/security/Pausable.sol";
            import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
            import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
            import "@openzeppelin/contracts/utils/Strings.sol";
            
            contract ${nftContractName} is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {

                string public name;

                constructor()
                    ERC1155("${metadata}")
                {
                    name = "${collectionName}"; //collection name
                    _mint(msg.sender, ${tokenId}, ${nftSupply}, "");
                }

                // to Put NFT to Opensea
                function uri(uint256 _tokenId) override public view returns (string memory) {
                    return string(
                        abi.encodePacked(
                            "${encodePacked}",
                            Strings.toString(_tokenId),
                            ".json"
                        )
                    );
                }

                function setURI(string memory newuri) public onlyOwner {
                    _setURI(newuri);
                }

                function pause() public onlyOwner {
                    _pause();
                }

                function unpause() public onlyOwner {
                    _unpause();
                }

                function mint(address account, uint256 id, uint256 amount, bytes memory data)
                    public
                    onlyOwner
                {
                    _mint(account, id, amount, data);
                }

                function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
                    public
                    onlyOwner
                {
                    _mintBatch(to, ids, amounts, data);
                }

                function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
                    internal
                    whenNotPaused
                    override(ERC1155, ERC1155Supply)
                {
                    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
                }
            }`;

            input.sources[nftContractName+'.sol'] = {content: contractCode};
            const output = JSON.parse(solc.compile(JSON.stringify(input), {import: findImports}));

            const contractOutput = output.contracts[nftContractName+'.sol'];

            let contractName = Object.keys(contractOutput)[0];
    
            const bytecode = contractOutput[contractName].evm.bytecode.object;
            const abi = contractOutput[contractName].abi;
    
            const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
            const deployedContract = await factory.deploy();
        
            // The contract is NOT deployed yet; we must wait until it is mined
            await deployedContract.deployed()
            const returnItem: ICommonObject =  {
                explorerLink: `${networkExplorers[network]}/address/${deployedContract.address}`,
                openseaLink: `${openseaExplorers[network]}/assets/${deployedContract.address}/${tokenId}`,
                address: deployedContract.address,
                transactionHash: deployedContract.deployTransaction.hash
            };

            return returnNodeExecutionData(returnItem);

        } catch(e) {
			throw handleErrorMessage(e);
		}
	}
}

module.exports = { nodeClass: CreateNFT }