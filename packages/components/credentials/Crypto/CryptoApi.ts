import { INodeParams, INodeCredential } from "../../src/Interface";

class CryptoApi implements INodeCredential {
  name: string;
  version: number;
  credentials: INodeParams[];

  constructor() {
    this.name = "cryptoApi";
    this.version = 1.0;
    this.credentials = [
      {
        label: "API Key",
        name: "apiKey",
        type: "string",
        default: "",
        description:
          '<a target="_blank" href="https://exchange-docs.crypto.com/spot/index.html#generating-the-api-key">Register Crypto.com Exchange account to get your API key.</a>"',
      },
      {
        label: "Secret Key",
        name: "secretKey",
        type: "string",
        default: "",
        description:
          '<a target="_blank" href="https://exchange-docs.crypto.com/spot/index.html#generating-the-api-key">Register Crypto.com Exchange account to get your Secret key.</a>"',
      },
    ];
  }
}

module.exports = { credClass: CryptoApi };
