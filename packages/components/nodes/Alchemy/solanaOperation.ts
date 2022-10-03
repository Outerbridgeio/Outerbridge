import { NETWORK, NETWORK_PROVIDER } from '../../src/ChainNetwork';
import { IETHOperation } from '../../src/ETHOperations';

export const solanaOperationsNetworks = [
    NETWORK.SOLANA,
    NETWORK.SOLANA_DEVNET
];

export const solanaAPIOperations = [
    {
        name: 'getTransaction',
        value: 'getTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns transaction details for a confirmed transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - transaction signature</li>
            <li><code class="inline">object</code> - (optional) Config object:</li>
            <ul>
                <li><code class="inline">commitment</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) encoding for tx data; Either "json", "jsonParsed", "base58" (slow), "base64". (default is "json")</li>
                <li><code class="inline">maxSupportedTransactionVersion</code>: <code class="inline">number</code> - (optional) set the max transaction version to return in responses. If the requested transaction is a higher version, an error will be returned.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "FhGuWorGjyu1sAMvn53GWb96apbExf8HvX18MVwexMQxmo2sweuSfFpoApJbMT19ijDHRRUk6kDbvE1kgNfRkse",
  {
    "commitment": "confirmed"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "blockTime": 1655319302,
                "meta": {
                    "err": null,
                    "fee": 5000,
                    "innerInstructions": [
                        {
                            "index": 1,
                            "instructions": [
                                {
                                    "accounts": [
                                        26,
                                        13,
                                        19,
                                        15,
                                        16,
                                        0
                                    ],
                                    "data": "63S77LdPnZrhcJ2wGjQ7xuV",
                                    "programIdIndex": 21
                                },
                                {
                                    "accounts": [
                                        14,
                                        16,
                                        0
                                    ],
                                    "data": "3QCBRJNuTemd",
                                    "programIdIndex": 26
                                },
                                {
                                    "accounts": [
                                        2,
                                        12,
                                        19
                                    ],
                                    "data": "3KiXXdFFB5Km",
                                    "programIdIndex": 26
                                }
                            ]
                        },
                    ]   
                }
            },
            "id": 1
        }
    },
    {
        name: 'sendTransaction',
        value: 'sendTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Submits a signed transaction to the cluster for processing.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">encoded string</code> - fully-signed Transaction</li>
            <li><code class="inline">object</code> - (optional) Config object:</li>
            <ul>
                <li><code class="inline">skipPreflight</code>: <code class="inline">bool</code> - if true, skip the preflight transaction checks (default: false)</li>
                <li><code class="inline">preflightCommitment</code>: <code class="inline">string</code> - (optional) Commitment level to use for preflight (default: "finalized").</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) Encoding used for the transaction data. Either "base58" (slow, DEPRECATED), or "base64". (default: "base58").</li>
                <li><code class="inline">maxRetries</code>: <code class="inline">usize</code> - (optional) Maximum number of times for the RPC node to retry sending the transaction to the leader. If this parameter is not provided, the RPC node will retry the transaction until it is finalized or until the blockhash expires.</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "AeF71jBTbqF33iO17K/WepKejY6ED8Db2t00aizbkvRpDUaX6mKZMInTbDgrOLTTPgOmYbE96Nlt2IwGmZKSpQ0BAAsZeGK9wdFlyWz2mdFDfZ3/65ZjurcmrptLNm5mN3f8p0ogsmSV/IVZRQW5a5ssHj+xTkSMSg6MvA28piZAJSLyxSNlSqXrkQU25XOnSMYzHuJNOeei2iMWq3lwa8TdxeqjJRFwcKkY21dentnVTDwl1cueQS/QUd9mUuo25ivPwYY3RX3yAyUj3Q6IaALYsHU/017gPZpDvHJJ7jrgSdN8dzeHLDAOEIF1ci79StKCB8hABC87tDUy+cyHrGjv7ceJbKfgtajeraDLc3Ndv8FX/Azg8HJ4eCu29Y+gxBJROld53yhEmAooyHHkcMEPF/qybgtUUE4DMxUftcYRcEeGtXsupOBa7USG+TC3fPVLShGfKH//XF/H9EyQut9RHKTrnofS6+89GaTLV8VZXwcr3giCPPZtOymEVDquZoAthk6pIbU9bjTY+O+NVm9AJVKtkUh02Is8rj1xlTRevQ65RutmBvIsMFSykgwwkEcthzgnj9RgOcNPV63bOnMwtnA25xGVrA5WPR3Cp/qLwsfk76yDUU1ksxe/AT+BbeZD6tzuifWhovJqdEpfnl+qwU5RSmm+bf9lGWui27urEkLY0SuJudyP3580cJpbEGtHLw85u2ypzgSw/X8ulxaI4uU7M7MexO/4+iia6oyVTAFjLi12SQjOVE1oZb3vERv/YSsBOP45MdZXb1/RCItG0H924+Qvzh1Vy52i1Sl3ULQWHFoPCOzzP1aH2CdIP9hLVSu8Mn+Lr2Nkvn22qA5HyDclu6nN/XmuJp8Db7aXm0uYp3KSexdu9rcZZXaHIfHx8uTmLfbItKhf4aZ9tE3BLeXbMw96xmty3GWK/t8PSkFbQ/9hSRqTERLd8b2BR80bZBN1959YJRJtZlSAh0Y0/QrOBfhDaTInzNg0xDUbatfDR7qLZN0mJVepe+fnfUZ28WcGm4uYWqtTKkUJDehVf83cvmy378c6CmWwb5IDXbc+7Aan1RcYx3TJKFZjmGkdXraLXrijm0ttXHNVWyEAAAAABt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKnVgl9CjQpAihYbPBN/CahLRcSHNFl1MS9n9YRISJ2GJAYWBAwTERcBAxYEAhQVFwEDFgQKFBUXAQMWBAYOEBcBAxYGCRcMAgoGAQcWDwQNAwYBDAsIBQcJDxIAGAkR+PwcVAIAAAA=",
  {
    "encoding": "base64",
    "skipPreflight": true,
    "preflightCommitment": "processed"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": "5WUPdF1zGiCbMX4dAGRrVJBvZuRjQatzsDJf8rcmLH8q67m8AoupcFsVNSo1CsPhLat4B3C2yZAtGp34yVgmcKNk"
        }
    },
    {
        name: 'getSignatureStatuses',
        value: 'getSignatureStatuses',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns the statuses of a list of signatures.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSignatureStatuses",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">array of base-58 encoded string</code> - An array of transaction signatures to confirm</li>
            <li><code class="inline">object</code> - (optional) Config object:</li>
            <ul>
                <li><code class="inline">searchTransactionHistory</code>: <code class="inline">bool</code> - if true, a Solana node will search its ledger cache for any signatures not found in the recent status cache</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  [
    "28P1gdVq52uEbCHns4EL5DCMjU5PtcBo5M3Gju4FX8DLwjLPDchudttnQapAxYy5dkdVZ6sqa6pvtgC5mbKLqfQA"
  ],
  {
    "searchTransactionHistory": true
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 137569378
                },
                "value": [
                    {
                        "confirmationStatus": "finalized",
                        "confirmations": null,
                        "err": null,
                        "slot": 137529522,
                        "status": {
                            "Ok": null
                        }
                    }
                ]
            }
        }
    },
    {
        name: 'getSignaturesForAddress',
        value: 'getSignaturesForAddress',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Returns signatures for confirmed transactions that include the given address in their accountKeys list. Returns signatures backwards in time from the provided signature or most recent confirmed block.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSignaturesForAddress",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - account address</li>
            <li><code class="inline">object</code> - (optional) Config object:</li>
            <ul>
                <li><code class="inline">limit</code>: <code class="inline">number</code> - (optional) maximum transaction signatures to return (between 1 and 1,000, default: 1,000).</li>
                <li><code class="inline">before</code>: <code class="inline">string</code> - (optional) start searching backwards from this transaction signature. If not provided the search starts from the top of the highest max confirmed block.</li>
                <li><code class="inline">until</code>: <code class="inline">string</code> - (optional) search until this transaction signature, if found before limit reached.</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at.</li>
                <li><code class="inline">commitment</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `[
  "Vote111111111111111111111111111111111111111",
  {
    "limit": 1
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": [
                {
                    "blockTime": 1654173549,
                    "confirmationStatus": "finalized",
                    "err": null,
                    "memo": null,
                    "signature": "67iWWgeXYSXxKmxMjAahr9ATXvv1SJoHedXYZxicFQtF4eFxCWJxUwEYczNbrua8pQAshmkf73gfAX5itutWTA7m",
                    "slot": 136105283
                }
            ],
            "id": 1
        }
    },
    {
        name: 'simulateTransaction',
        value: 'simulateTransaction',
        parentGroup: 'Reading & Writing Transactions',
        description: 'Simulate sending a transaction.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"simulateTransaction",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">string</code> - Transaction, as an encoded string. The transaction must have a valid blockhash, but is not required to be signed.</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">sigVerify</code> -  if true the transaction signatures will be verified (default: false, conflicts with replaceRecentBlockhash).</li>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code> - (optional) Encoding used for the transaction data. Accepts one of the following strings: ["base64" (default), "base64+zstd" or "jsonParsed"]</li>
                <li><code class="inline">replaceRecentBlockhash</code> - (optional) if true the transaction recent blockhash will be replaced with the most recent blockhash. (default: false, conflicts with sigVerify).</li>
                <li><code class="inline">accounts </code>: <code class="inline">object</code> - (optional) Accounts configuration object containing the following fields:</li>
                <ul>
                    <li><code class="inline">encoding</code> - (optional) encoding for returned Account data, either "base64" (default), "base64+zstd" or "jsonParsed". "jsonParsed" encoding attempts to use program-specific state parsers to return more human-readable and explicit account state data. If "jsonParsed" is requested but a parser cannot be found, the field falls back to binary encoding, detectable when the data field is type string.</li>
                    <li><code class="inline">addresses</code> - An array of accounts to return, as base-58 encoded strings.</li>
                </ul>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAgiFt0xk+FyHf76k7/dkz9vjFqSY8vhrizSEx2GWidkQ5ewAKY7OUUt6ZEIryxOHEx1w1mGioe0SGujvGtbbPvaSDCG6EGTb0+Q1B98oAxfD0GiOZwOLQW1IkeOC71yX0NQm+LOK6+h53IwvrgMD9JNZme6u7PeARqlqZzOD4iRLRnyGE+3cPqKW5IiU66yIZZOgOtO4B9TYReBdaWsp+Dx5lyxj0FXRm/6oiIDpU9abZ6qIYeIKRR96fuhXeHpmjwUMJxNk9vhCZs3zhxL/0CZLdm0EbWEwrD4A7KBrPOYP2gbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCph9Yfdu8NCN6d9KtOQeMPovh7jKgKo56yxXQO8eTA6XUBBgcAAgEDBQQH4gMobmZ0X2FjY291bnQ6ICI5enlMTjVDUXd4V3JFUGl0MXNGeTVEWjV4TXFKZk5RVExpcUJWU2Z2UHZXWSIsCiAgICBkYXRhX2FjY291bnQ6ICIzZDhTcG5abnRtR0t0dlVtaHVhazdLU3U2WFQ3QVVNaW51VURtYTVobWlCWCIsCiAgICBjb2luX3NyY19hY2N0OiAiQkI3cGN0UGVWQ1FQalhNR2RrRFg5QURUOTk1Z1hDVkx5SEpVeWdwSlBOMngiLAogICAgY29pbl9kZXN0X2FjY3Q6ICI5UDY4a2J2VzlLelBIc1pURnE0eVFyUlZrWXNmNUNRRmc5aFZoeUJaZHBQMiIsCiAgICB0cmFuc2Zlcl9hdXRob3JpdHk6ICJwTWludFRaNUNFa0hVaGdydXJQZ29pTW50b0xnRndic0tkYnFOclhzcmR5IiwKICAgIGFjdGl2aXR5OiAxLCAKICAgIHBheV9wZXJpb2Q6IDYwNDgwMC4wMDAwMDAsIAogICAgcGF5X3JhdGU6IDguMDAwMDAwLAogICAgdGltZXN0YW1wOiAxNjU1MTg0ODYwLAogICAgbXVsdGlwbGllcjogMS4wLAogICAgbWF4X3BheW91dDogMTYuMDAwMDAwKQ==",
  {
    "encoding": "base64",
    "commitment": "recent",
    "sigVerify": false,
    "accounts": {
        "addresses": [
            "9zyLN5CQwxWrEPit1sFy5DZ5xMqJfNQTLiqBVSfvPvWY",
            "GtFMtrW31RdCeSdW4ot3jNVuoLtFywJGGTiF1Q8Uopky",
            "pMintTZ5CEkHUhgrurPgoiMntoLgFwbsKdbqNrXsrdy",
            "3d8SpnZntmGKtvUmhuak7KSu6XT7AUMinuUDma5hmiBX",
            "9P68kbvW9KzPHsZTFq4yQrRVkYsf5CQFg9hVhyBZdpP2",
            "BB7pctPeVCQPjXMGdkDX9ADT995gXCVLyHJUygpJPN2x",
            "pSTAkE7Z2guBmSheg6tHdHk3rT1wmF1Mfuf52tnWeAd",
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        ]
    }
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 137569919
                },
                "value": {
                    "accounts": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    "err": "BlockhashNotFound",
                    "logs": [],
                    "unitsConsumed": 0
                }
            },
            "id": 1
        }
    },
    {
        name: 'getBlockProduction',
        value: 'getBlockProduction',
        parentGroup: 'Getting Blocks',
        description: 'Returns recent block production information from the current or previous epoch.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockProduction",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getBlock',
        value: 'getBlock',
        parentGroup: 'Getting Blocks',
        description: 'Returns identity and transaction information about a confirmed block in the ledger.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlock",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">u64</code> - a slot integer denoting the target block number.</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">transactionDetails</code>: <code class="inline">string</code> - (optional) level of transaction detail to return. Accepts one of the following strings: ["full" (Default), "signatures", or "none"]</li>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) data encoding for each returned transaction. Accepts one of the following strings: ["json" (Default), "jsonParsed", "base58" (slow), "base64"]</li>
                <li><code class="inline">rewards</code>: <code class="inline">bool</code> - (optional) whether to populate the rewards array. true m(Default)</li>
                <li><code class="inline">maxSupportedTransactionVersion</code>: <code class="inline">number</code> - (optional) sets the maximum transaction version.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  430, 
  {
    "encoding": "json",
    "transactionDetails":"full",
    "rewards":false
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
              "blockHeight": 428,
              "blockTime": null,
              "blockhash": "3Eq21vXNB5s86c62bVuUfTeaMif1N2kUqRPBmGRJhyTA",
              "parentSlot": 429,
              "previousBlockhash": "mfcyqEXB3DnHXki6KjjmZck6YjmZLvpAByy2fj4nh6B",
              "transactions": [
                {
                  "meta": {
                    "err": null,
                    "fee": 5000,
                    "innerInstructions": [],
                    "logMessages": [],
                    "postBalances": [499998932500, 26858640, 1, 1, 1],
                    "postTokenBalances": [],
                    "preBalances": [499998937500, 26858640, 1, 1, 1],
                    "preTokenBalances": [],
                    "status": {
                      "Ok": null
                    }
                  },
                  "transaction": {
                    "message": {
                      "accountKeys": [
                        "3UVYmECPPMZSCqWKfENfuoTv51fTDTWicX9xmBD2euKe",
                        "AjozzgE83A3x1sHNUR64hfH7zaEBWeMaFuAN9kQgujrc",
                        "SysvarS1otHashes111111111111111111111111111",
                        "SysvarC1ock11111111111111111111111111111111",
                        "Vote111111111111111111111111111111111111111"
                      ],
                      "header": {
                        "numReadonlySignedAccounts": 0,
                        "numReadonlyUnsignedAccounts": 3,
                        "numRequiredSignatures": 1
                      },
                      "instructions": [
                        {
                          "accounts": [1, 2, 3, 0],
                          "data": "37u9WtQpcm6ULa3WRQHmj49EPs4if7o9f1jSRVZpm2dvihR9C8jY4NqEwXUbLwx15HBSNcP1",
                          "programIdIndex": 4
                        }
                      ],
                      "recentBlockhash": "mfcyqEXB3DnHXki6KjjmZck6YjmZLvpAByy2fj4nh6B"
                    },
                    "signatures": [
                      "2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv"
                    ]
                  }
                }
              ]
            },
            "id": 1
        }
    },
    {
        name: 'getBlocks',
        value: 'getBlocks',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks between two slots.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlocks",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">u64</code> - starting slot integer</li>
            <li><code class="inline">u64</code> - (optional) ending slot integer</li>
            <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
            <ul>
                <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
		</ul>`,
        exampleParameters: `[5, 10]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": [
                5,
                6,
                7,
                8,
                9,
                10
            ],
            "id": 1
        }
    },
    {
        name: 'getBlocksWithLimit',
        value: 'getBlocksWithLimit',
        parentGroup: 'Getting Blocks',
        description: 'Returns a list of confirmed blocks starting at the given slot.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlocksWithLimit",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">u64</code> - starting slot integer</li>
            <li><code class="inline">u64</code> - (optional) ending slot integer</li>
            <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
            <ul>
                <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
            </ul>
		</ul>`,
        exampleParameters: `[5, 3]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": [
                5,
                6,
                7
            ],
            "id": 1
        }
    },
    {
        name: 'getBlockHeight',
        value: 'getBlockHeight',
        parentGroup: 'Getting Blocks',
        description: 'Returns the current block height of the node.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBlockHeight",
            "params":[],
            "id":1
        },
    },
    {
        name: 'isBlockhashValid',
        value: 'isBlockhashValid',
        parentGroup: 'Getting Blocks',
        description: 'Returns whether a blockhash is still valid or not.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"isBlockhashValid",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">blockhash</code>: <code class="inline">base-58 encoded string</code> - the blockhash of this block</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "J7rBdM6AecPDEZp8aPq5iPSNKVkU5Q76F3oAV4eW5wsW",
  {
    "commitment": "processed"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 136103237
                },
                "value": false
            },
            "id": 1
        }
    },
    {
        name: 'getTokenAccountsByOwner',
        value: 'getTokenAccountsByOwner',
        parentGroup: 'Token Information',
        description: 'Returns all SPL Token accounts by token owner.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenAccountsByOwner",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - Pubkey of queried SPL token account owner</li>
            <li><code class="inline">object</code> - Either:</li>
            <ul>
                <li><code class="inline">mint</code> - Pubkey of the specific token Mint to limit accounts to, as base-58 encoded string.</li>
                <li><code class="inline">programId</code> - Pubkey of the Token program ID that owns the accounts, as base-58 encoded string.</li>
            </ul>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) data encoding for each returned transaction. Accepts one of the following strings: ["json" (Default), "jsonParsed", "base58" (slow), "base64"]</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
                <li><code class="inline">dataSlice</code>: <code class="inline">object</code> - (optional) limits the returned account data using the provided <code class="inline">offset: usize</code> and <code class="inline">length: usize</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "J27ma1MPBRvmPJxLqBqQGNECMXDm9L6abFa4duKiPosa",
  {
    "mint": "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"
  },
  {
    "encoding": "jsonParsed"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 137568828
                },
                "value": [
                    {
                        "account": {
                            "data": {
                                "parsed": {
                                    "info": {
                                        "isNative": false,
                                        "mint": "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
                                        "owner": "J27ma1MPBRvmPJxLqBqQGNECMXDm9L6abFa4duKiPosa",
                                        "state": "initialized",
                                        "tokenAmount": {
                                            "amount": "821",
                                            "decimals": 6,
                                            "uiAmount": 8.21E-4,
                                            "uiAmountString": "0.000821"
                                        }
                                    },
                                    "type": "account"
                                },
                                "program": "spl-token",
                                "space": 165
                            },
                            "executable": false,
                            "lamports": 2039280,
                            "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "rentEpoch": 318
                        },
                        "pubkey": "Exo9AH6fNchE43GaJB85FT7ToYiuKnKzYDyW5mFeTXRR"
                    }
                ]
            },
            "id": 1
        }
    },
    {
        name: 'getTokenAccountBalance',
        value: 'getTokenAccountBalance',
        parentGroup: 'Token Information',
        description: 'Returns the token balance of an SPL Token account.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenAccountBalance",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - Pubkey of queried token account</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `[
            "3Lz6rCrXdLybFiuJGJnEjv6Z2XtCh5n4proPGP2aBkA1"
        ]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 137567036
                },
                "value": {
                    "amount": "301922375078",
                    "decimals": 6,
                    "uiAmount": 301922.375078,
                    "uiAmountString": "301922.375078"
                }
            },
            "id": 1
        }
    },
    {
        name: 'getTokenSupply',
        value: 'getTokenSupply',
        parentGroup: 'Token Information',
        description: 'Returns the total supply of an SPL Token type.',
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getTokenSupply",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - Pubkey of token Mint to query</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `[
            "HfYFjMKNZygfMC8LsQ8LtpPsPxEJoXJx4M6tqi75Hajo"
        ]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 137571639
                },
                "value": {
                    "amount": "999999999997060679",
                    "decimals": 9,
                    "uiAmount": 9.999999999970608E8,
                    "uiAmountString": "999999999.997060679"
                }
            },
            "id": 1
        }
    },
    {
        name: 'getEpochSchedule',
        value: 'getEpochSchedule',
        parentGroup: 'Network Information',
        description: `Returns epoch schedule information from this cluster's genesis config.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getEpochSchedule",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getEpochInfo',
        value: 'getEpochInfo',
        parentGroup: 'Network Information',
        description: `Returns information about the current epoch.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getEpochInfo",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getFeeForMessage',
        value: 'getFeeForMessage',
        parentGroup: 'Network Information',
        description: `Get the fee the network will charge for a particular message.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFeeForMessage",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - encoded Message</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `["AQABAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAA"]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 135143215
                },
                "value": null
            },
            "id": 1
        }
    },
    {
        name: 'getHighestSnapshotSlot',
        value: 'getHighestSnapshotSlot',
        parentGroup: 'Network Information',
        description: `Returns the highest slot information that the node has snapshots for.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getHighestSnapshotSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getGenesisHash',
        value: 'getGenesisHash',
        parentGroup: 'Network Information',
        description: `Returns the genesis hash.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getGenesisHash",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getRecentPerformanceSamples',
        value: 'getRecentPerformanceSamples',
        parentGroup: 'Network Information',
        description: `Returns a list of recent performance samples, in reverse slot order. Performance samples are taken every 60 seconds and include the number of transactions and slots that occur in a given time window.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getRecentPerformanceSamples",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getFirstAvailableBlock',
        value: 'getFirstAvailableBlock',
        parentGroup: 'Network Information',
        description: `Get the fee the network will charge for a particular message.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getFirstAvailableBlock",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getMinimumBalanceForRentExemption',
        value: 'getMinimumBalanceForRentExemption',
        parentGroup: 'Network Information',
        description: `Returns minimum balance required to make account rent exempt.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMinimumBalanceForRentExemption",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">usize</code> - account data length</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `[
            50
        ]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": 1238880,
            "id": 1
        }
    },
    {
        name: 'getClusterNodes',
        value: 'getClusterNodes',
        parentGroup: 'Node Information',
        description: `Returns information about all the nodes participating in the cluster.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getClusterNodes",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getHealth',
        value: 'getHealth',
        parentGroup: 'Node Information',
        description: `Returns the current health of the node.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getHealth",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getVersion',
        value: 'getVersion',
        parentGroup: 'Node Information',
        description: `Returns the current solana versions running on the node.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getVersion",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getIdentity',
        value: 'getIdentity',
        parentGroup: 'Node Information',
        description: `Returns the identity pubkey for the current node.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getIdentity",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getInflationGovernor',
        value: 'getInflationGovernor',
        parentGroup: 'Network Inflation',
        description: `Returns the current inflation governor.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationGovernor",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getInflationReward',
        value: 'getInflationReward',
        parentGroup: 'Network Inflation',
        description: `Returns the inflation / staking reward for a list of addresses for an epoch.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationReward",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">array of base-58 encoded strings</code> - An array of addresses to query</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">epoch</code>: <code class="inline">u64</code> - (optional) An epoch for which the reward occurs. If omitted, the previous epoch will be used</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  ["9zyLN5CQwxWrEPit1sFy5DZ5xMqJfNQTLiqBVSfvPvWY"],
  {
    "commitment": "confirmed"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": 1238880,
            "id": 1
        }
    },
    {
        name: 'getInflationRate',
        value: 'getInflationRate',
        parentGroup: 'Network Inflation',
        description: `Returns the specific inflation values for the current epoch.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getInflationRate",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getSupply',
        value: 'getSupply',
        parentGroup: 'Network Inflation',
        description: `Returns information about the current supply.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSupply",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getBalance',
        value: 'getBalance',
        parentGroup: 'Account Information',
        description: `Returns the balance of the account of provided Pubkey.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getBalance",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - Pubkey of account to query</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">commitment</code>: <code class="inline">string</code> - (optional) Configures the commitment level of the blocks queried. Accepts one of the following strings:</li>
                <ul>
                    <li><code class="inline">finalized</code> - the node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized.</li>
                    <li><code class="inline">confirmed</code> - the node will query the most recent block that has been voted on by supermajority of the cluster.</li>
                    <li><code class="inline">processed</code> - the node will query its most recent block. Note that the block may not be complete.</li>
                </ul>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
            </ul>
		</ul>`,
        exampleParameters: `[
            "83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri"
        ]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": { "context": { "slot": 1 }, "value": 0 },
            "id": 1
        }
    },
    {
        name: 'getLargestAccounts',
        value: 'getLargestAccounts',
        parentGroup: 'Account Information',
        description: `Returns the 20 largest accounts, by lamport balance (results may be cached up to two hours).`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getLargestAccounts",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getAccountInfo',
        value: 'getAccountInfo',
        parentGroup: 'Account Information',
        description: `Returns all information associated with the account of provided Pubkey.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getAccountInfo",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
			<li><code class="inline">base-58 encoded string</code> - Pubkey of account to query</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) data encoding for each returned transaction. Accepts one of the following strings: ["json" (Default), "jsonParsed", "base58" (slow), "base64"]</li>
                <li><code class="inline">dataSlice</code>: <code class="inline">object</code> - (optional) limits the returned account data using the provided <code class="inline">offset: usize</code> and <code class="inline">length: usize</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
  {
    "encoding": "base58"
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 134461197
                },
                "value": {
                    "data": [
                        "",
                        "base58"
                    ],
                    "executable": false,
                    "lamports": 410431055,
                    "owner": "11111111111111111111111111111111",
                    "rentEpoch": 311
                }
            },
            "id": 1
        }
    },
    {
        name: 'getVoteAccounts',
        value: 'getVoteAccounts',
        parentGroup: 'Account Information',
        description: `Returns the account info and associated stake for all the voting accounts in the current bank.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getVoteAccounts",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getMultipleAccounts',
        value: 'getMultipleAccounts',
        parentGroup: 'Account Information',
        description: `Returns the account information for a list of Pubkeys.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMultipleAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">array of base-58 encoded strings</code> - An array of addresses to query</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) data encoding for each returned transaction. Accepts one of the following strings: ["json" (Default), "jsonParsed", "base58" (slow), "base64"]</li>
                <li><code class="inline">dataSlice</code>: <code class="inline">object</code> - (optional) limits the returned account data using the provided <code class="inline">offset: usize</code> and <code class="inline">length: usize</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
            </ul>
		</ul>`,
        exampleParameters: `[
  [
    "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
    "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA"
  ],
  {
    "dataSlice": {
        "offset": 0,
        "length": 0
    }
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": {
                "context": {
                    "slot": 136100846
                },
                "value": [
                    {
                        "data": [
                            "",
                            "base64"
                        ],
                        "executable": false,
                        "lamports": 410426055,
                        "owner": "11111111111111111111111111111111",
                        "rentEpoch": 314
                    },
                    {
                        "data": [
                            "",
                            "base64"
                        ],
                        "executable": false,
                        "lamports": 2000000,
                        "owner": "11111111111111111111111111111111",
                        "rentEpoch": 314
                    }
                ]
            },
            "id": 1
        }
    },
    {
        name: 'getProgramAccounts',
        value: 'getProgramAccounts',
        parentGroup: 'Account Information',
        description: `Returns all accounts owned by the provided program Pubkey.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getProgramAccounts",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">base-58 encoded string</code> - Pubkey of program</li>
            <li><code class="inline">object</code> - (optional) Configuration object containing the following optional fields:</li>
            <ul>
                <li><code class="inline">encoding</code>: <code class="inline">string</code> - (optional) data encoding for each returned transaction. Accepts one of the following strings: ["json" (Default), "jsonParsed", "base58" (slow), "base64"]</li>
                <li><code class="inline">dataSlice</code>: <code class="inline">object</code> - (optional) limits the returned account data using the provided <code class="inline">offset: usize</code> and <code class="inline">length: usize</code> fields; only available for "base58", "base64" or "base64+zstd" encodings.</li>
                <li><code class="inline">minContextSlot</code>: <code class="inline">number</code> - (optional) set the minimum slot that the request can be evaluated at</li>
                <li><code class="inline">withContext</code>: <code class="inline">bool</code> - (optional) wrap the result in an RpcResponse JSON object.</li>
                <li><code class="inline">filters</code>: <code class="inline">array</code> - (optional) filter results using various filter objects; account must meet all filter criteria to be included in results</li>
                <ul>
                    <li><code class="inline">memcmp</code>: <code class="inline">object</code> - (optional) compares a provided series of bytes with program account data at a particular offset. Fields:</li>
                    <ul>
                        <li><code class="inline">offset</code>: <code class="inline">usize</code> - (optional) offset into program account data to start comparison</li>
                        <li><code class="inline">bytes</code>: <code class="inline">string</code> - (optional) data to match, as base-58 encoded string and limited to less than 129 bytes</li>
                    </ul>
                    <li><code class="inline">dataSize</code>: <code class="inline">u64</code> - (optional) compares the program account data length with the provided data size</li>
                </ul>
            </ul>
		</ul>`,
        exampleParameters: `[
  "Stake11111111111111111111111111111111111111",
  {
    "encoding": "jsonParsed",
    "commitment": "recent",
    "filters": [
        {
            "memcmp": {
                "offset": 44,
                "bytes": "65qFmhCmDgXjg1duFdcpYyPheWyWGyusZhy3Y8khMoYm"
            }
        }
    ]
  }
]`,
        exampleResponse: {
            "jsonrpc": "2.0",
            "result": [
              {
                "account": {
                  "data": "2R9jLfiAQ9bgdcw6h8s44439",
                  "executable": false,
                  "lamports": 15298080,
                  "owner": "4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T",
                  "rentEpoch": 28
                },
                "pubkey": "CxELquR1gPP8wHe33gZ4QxqGB3sZ9RSwsJ2KshVewkFY"
              }
            ],
            "id": 1
        }
    },
    {
        name: 'minimumLedgerSlot',
        value: 'minimumLedgerSlot',
        parentGroup: 'Slot Information',
        description: `Returns the lowest slot that the node has information about in its ledger. This value may increase over time if the node is configured to purge older ledger data.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"minimumLedgerSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getMaxShredInsertSlot',
        value: 'getMaxShredInsertSlot',
        parentGroup: 'Slot Information',
        description: `Get the max slot seen from after shred insert`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMaxShredInsertSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getSlotLeader',
        value: 'getSlotLeader',
        parentGroup: 'Slot Information',
        description: `Returns the current slot leader.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlotLeader",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getSlotLeaders',
        value: 'getSlotLeaders',
        parentGroup: 'Slot Information',
        description: `Returns the slot leaders for a given slot range.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlotLeader",
            "params":[],
            "id":1
        },
        inputParameters: `
        <ul>
            <li><code class="inline">array</code> - array with first item as start slot, second item as limit:</li>
            <ul>
                <li><code class="inline">u64</code> - Start slot</li>
                <li><code class="inline">u64 </code> - Limit of the number of slot leaders in the response payload.</li>
            </ul>
        </ul>
        `,
        exampleParameters: `[
            5,
            10
        ]`,
    },
    {
        name: 'getSlot',
        value: 'getSlot',
        parentGroup: 'Slot Information',
        description: `Returns the slot that has reached the given or default commitment level.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getSlot",
            "params":[],
            "id":1
        },
    },
    {
        name: 'getMaxRetransmitSlot',
        value: 'getMaxRetransmitSlot',
        parentGroup: 'Slot Information',
        description: `Get the max slot seen from retransmit stage.`,
        providerNetworks: {
            [NETWORK_PROVIDER.ALCHEMY]: solanaOperationsNetworks
        },
        method: 'POST',
        body: {
            "jsonrpc":"2.0",
            "method":"getMaxRetransmitSlot",
            "params":[],
            "id":1
        },
    },
] as IETHOperation[];