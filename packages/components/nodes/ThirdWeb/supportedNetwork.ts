import { INodeOptionsValue } from '../../src'
import { NETWORK, NETWORK_LABEL } from '../../src/ChainNetwork'

export type prebuiltType =
    | 'edition'
    | 'edition-drop'
    | 'marketplace'
    | 'multiwrap'
    | 'nft-collection'
    | 'nft-drop'
    | 'pack'
    | 'signature-drop'
    | 'split'
    | 'token'
    | 'token-drop'
    | 'vote'

export const ThirdWebSupportedNetworks = [
    {
        label: NETWORK_LABEL.MAINNET,
        name: 'mainnet'
    },
    {
        label: NETWORK_LABEL.GÖRLI,
        name: 'goerli'
    },
    {
        label: NETWORK_LABEL.MATIC,
        name: 'polygon'
    },
    {
        label: NETWORK_LABEL.MATIC_MUMBAI,
        name: 'mumbai'
    },
    {
        label: NETWORK_LABEL.ARBITRUM,
        name: NETWORK.ARBITRUM
    },
    {
        label: NETWORK_LABEL.ARBITRUM_GOERLI,
        name: NETWORK.ARBITRUM_GOERLI
    },
    {
        label: NETWORK_LABEL.AVALANCHE,
        name: NETWORK.AVALANCHE
    },
    {
        label: NETWORK_LABEL.AVALANCHE_TESTNET,
        name: NETWORK.AVALANCHE_TESTNET
    },
    {
        label: NETWORK_LABEL.OPTIMISM,
        name: NETWORK.OPTIMISM
    },
    {
        label: NETWORK_LABEL.OPTIMISM_GOERLI,
        name: NETWORK.OPTIMISM_GOERLI
    },
    {
        label: NETWORK_LABEL.FANTOM,
        name: NETWORK.FANTOM
    },
    {
        label: NETWORK_LABEL.FANTOM_TESTNET,
        name: NETWORK.FANTOM_TESTNET
    },
    {
        label: NETWORK_LABEL.BSC,
        name: 'binance'
    },
    {
        label: NETWORK_LABEL.BSC_TESTNET,
        name: 'binance-testnet'
    }
    /*
    {
        label: NETWORK_LABEL.SOLANA,
        name: 'mainnet-beta'
    },
    {
        label: NETWORK_LABEL.SOLANA_DEVNET,
        name: 'devnet'
    },
    {
        label: NETWORK_LABEL.SOLANA_TESTNET,
        name: 'testnet'
    }
    */
] as INodeOptionsValue[]

export const ThirdWebSupportedPrebuiltContract = [
    {
        label: 'Edition',
        name: 'edition',
        description: 'Create editions of ERC1155 tokens'
    },
    {
        label: 'Edition Drop',
        name: 'edition-drop',
        description: 'Release ERC1155 tokens for a set price.'
    },
    {
        label: 'Marketplace',
        name: 'marketplace',
        description: 'Buy and sell ERC721/ERC1155 tokens'
    },
    {
        label: 'Multiwrap',
        name: 'multiwrap',
        description: 'Bundle multiple ERC721/ERC1155/ERC20 tokens into a single ERC721.'
    },
    {
        label: 'NFT Collection',
        name: 'nft-collection',
        description: 'Create collection of unique NFTs.'
    },
    {
        label: 'NFT Drop',
        name: 'nft-drop',
        description: 'Release collection of unique NFTs for a set price'
    },
    {
        label: 'Pack',
        name: 'pack',
        description: 'Pack multiple tokens into ERC1155 NFTs that act as randomized loot boxes'
    },
    {
        label: 'Signature Drop',
        name: 'signature-drop',
        description: 'Signature based minting of ERC721 tokens.'
    },
    {
        label: 'Split',
        name: 'split',
        description: 'Distribute funds among multiple recipients'
    },
    {
        label: 'Token',
        name: 'token',
        description: 'Create cryptocurrency compliant with ERC20 standard'
    },
    {
        label: 'Token Drop',
        name: 'token-drop',
        description: 'Release new ERC20 tokens for a set price'
    },
    {
        label: 'Vote',
        name: 'vote',
        description: 'Create and vote on proposals'
    }
] as INodeOptionsValue[]

interface IThirdWebNetwork {
    [key: string]: NETWORK
}

export const networkLookup: IThirdWebNetwork = {
    mainnet: NETWORK.MAINNET,
    goerli: NETWORK.GÖRLI,
    polygon: NETWORK.MATIC,
    mumbai: NETWORK.MATIC_MUMBAI,
    binance: NETWORK.BSC,
    'binance-testnet': NETWORK.BSC_TESTNET,
    [NETWORK.ARBITRUM]: NETWORK.ARBITRUM,
    [NETWORK.ARBITRUM_GOERLI]: NETWORK.ARBITRUM_GOERLI,
    [NETWORK.AVALANCHE]: NETWORK.AVALANCHE,
    [NETWORK.AVALANCHE_TESTNET]: NETWORK.AVALANCHE_TESTNET,
    [NETWORK.OPTIMISM]: NETWORK.OPTIMISM,
    [NETWORK.OPTIMISM_GOERLI]: NETWORK.OPTIMISM_GOERLI,
    [NETWORK.FANTOM]: NETWORK.FANTOM,
    [NETWORK.FANTOM_TESTNET]: NETWORK.FANTOM_TESTNET
}

export const nftDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'TokenURIRevealed',
        name: 'TokenURIRevealed'
    }
] as INodeOptionsValue[]

export const nftCollectionEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
] as INodeOptionsValue[]

export const marketplaceEvents = [
    {
        label: 'NewSale',
        name: 'NewSale'
    },
    {
        label: 'NewOffer',
        name: 'NewOffer'
    },
    {
        label: 'ListingAdded',
        name: 'ListingAdded'
    },
    {
        label: 'ListingUpdated',
        name: 'ListingUpdated'
    },
    {
        label: 'ListingRemoved',
        name: 'ListingRemoved'
    },
    {
        label: 'AuctionClosed',
        name: 'AuctionClosed'
    },
    {
        label: 'AuctionBuffersUpdated',
        name: 'AuctionBuffersUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
] as INodeOptionsValue[]

export const editionDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'SaleRecipientForTokenUpdated',
        name: 'SaleRecipientForTokenUpdated'
    },
    {
        label: 'URI',
        name: 'URI'
    }
] as INodeOptionsValue[]

export const tokenEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'DelegateChanged',
        name: 'DelegateChanged'
    },
    {
        label: 'DelegateVotesChanged',
        name: 'DelegateVotesChanged'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
] as INodeOptionsValue[]

export const tokenDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ClaimConditionsUpdated',
        name: 'ClaimConditionsUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DelegateChanged',
        name: 'DelegateChanged'
    },
    {
        label: 'DelegateVotesChanged',
        name: 'DelegateVotesChanged'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'MaxTotalSupplyUpdated',
        name: 'MaxTotalSupplyUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
] as INodeOptionsValue[]

export const editionEvents = [
    {
        label: 'TokensMinted',
        name: 'TokensMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'FlatPlatformFeeUpdated',
        name: 'FlatPlatformFeeUpdated'
    },
    {
        label: 'OperatorRestriction',
        name: 'OperatorRestriction'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PlatformFeeTypeUpdated',
        name: 'PlatformFeeTypeUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'URI',
        name: 'URI'
    }
] as INodeOptionsValue[]

export const multiWrapEvents = [
    {
        label: 'TokensUnwrapped',
        name: 'TokensUnwrapped'
    },
    {
        label: 'TokensWrapped',
        name: 'TokensWrapped'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
] as INodeOptionsValue[]

export const packEvents = [
    {
        label: 'PackCreated',
        name: 'PackCreated'
    },
    {
        label: 'PackOpened',
        name: 'PackOpened'
    },
    {
        label: 'PackUpdated',
        name: 'PackUpdated'
    },
    {
        label: 'TransferBatch',
        name: 'TransferBatch'
    },
    {
        label: 'TransferSingle',
        name: 'TransferSingle'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    },
    {
        label: 'URI',
        name: 'URI'
    }
] as INodeOptionsValue[]

export const signatureDropEvents = [
    {
        label: 'TokensClaimed',
        name: 'TokensClaimed'
    },
    {
        label: 'TokensLazyMinted',
        name: 'TokensLazyMinted'
    },
    {
        label: 'TokensMintedWithSignature',
        name: 'TokensMintedWithSignature'
    },
    {
        label: 'TokenURIRevealed',
        name: 'TokenURIRevealed'
    },
    {
        label: 'Transfer',
        name: 'Transfer'
    },
    {
        label: 'Approval',
        name: 'Approval'
    },
    {
        label: 'ApprovalForAll',
        name: 'ApprovalForAll'
    },
    {
        label: 'ClaimConditionUpdated',
        name: 'ClaimConditionUpdated'
    },
    {
        label: 'ContractURIUpdated',
        name: 'ContractURIUpdated'
    },
    {
        label: 'DefaultRoyalty',
        name: 'DefaultRoyalty'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    },
    {
        label: 'OwnerUpdated',
        name: 'OwnerUpdated'
    },
    {
        label: 'PlatformFeeInfoUpdated',
        name: 'PlatformFeeInfoUpdated'
    },
    {
        label: 'PrimarySaleRecipientUpdated',
        name: 'PrimarySaleRecipientUpdated'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    },
    {
        label: 'RoyaltyForToken',
        name: 'RoyaltyForToken'
    }
] as INodeOptionsValue[]

export const splitEvents = [
    {
        label: 'ERC20PaymentReleased',
        name: 'ERC20PaymentReleased'
    },
    {
        label: 'PaymentReceived',
        name: 'PaymentReceived'
    },
    {
        label: 'PaymentReleased',
        name: 'PaymentReleased'
    },
    {
        label: 'PayeeAdded',
        name: 'PayeeAdded'
    },
    {
        label: 'RoleAdminChanged',
        name: 'RoleAdminChanged'
    },
    {
        label: 'RoleGranted',
        name: 'RoleGranted'
    },
    {
        label: 'RoleRevoked',
        name: 'RoleRevoked'
    }
] as INodeOptionsValue[]

export const voteEvents = [
    {
        label: 'ProposalCreated',
        name: 'ProposalCreated'
    },
    {
        label: 'ProposalExecuted',
        name: 'ProposalExecuted'
    },
    {
        label: 'ProposalCanceled',
        name: 'ProposalCanceled'
    },
    {
        label: 'ProposalThresholdSet',
        name: 'ProposalThresholdSet'
    },
    {
        label: 'VoteCast',
        name: 'VoteCast'
    },
    {
        label: 'VoteCastWithParams',
        name: 'VoteCastWithParams'
    },
    {
        label: 'VotingDelaySet',
        name: 'VotingDelaySet'
    },
    {
        label: 'VotingPeriodSet',
        name: 'VotingPeriodSet'
    },
    {
        label: 'QuorumNumeratorUpdated',
        name: 'QuorumNumeratorUpdated'
    },
    {
        label: 'Initialized',
        name: 'Initialized'
    }
] as INodeOptionsValue[]
