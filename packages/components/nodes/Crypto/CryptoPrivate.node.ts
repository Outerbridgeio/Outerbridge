import {
  ICommonObject,
  INode,
  INodeData,
  INodeExecutionData,
  INodeOptionsValue,
  INodeParams,
  NodeType,
} from "../../src/Interface";
import {
  handleErrorMessage,
  returnNodeExecutionData,
  serializeQueryParams,
  returnCountryList,
} from "../../src/utils";
import cryptoJs from "crypto-js";
import axios, { AxiosRequestConfig, Method } from "axios";
import FormData from "form-data";

class CryptoPrivate implements INode {
  label: string;
  name: string;
  icon: string;
  type: NodeType;
  description: string;
  version: number;
  incoming: number;
  outgoing: number;
  actions?: INodeParams[];
  credentials?: INodeParams[];
  inputParameters?: INodeParams[];

  constructor() {
    this.label = "Crypto.com Private";
    this.name = "CryptoPrivate";
    this.icon = "Crypto-Logo.png";
    this.type = "action";
    this.description =
      "Crypto.com Private API that require API and Secret keys";
    this.version = 1.0;
    this.incoming = 1;
    this.outgoing = 1;
    this.actions = [
      {
        label: "Network",
        name: "network",
        type: "options",
        description: "Network to execute API: Test or Real",
        options: [
          {
            label: "TEST",
            name: "test",
            description: "Test network: https://uat-api.3ona.co/v2/",
          },
          {
            label: "LIVE",
            name: "live",
            description: "Live network: https://api.crypto.com/v2/",
          },
        ],
        default: "live",
      },
      {
        label: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            label: "Get Deposit History",
            name: "getDepositHistory",
            description: "Get deposit history.",
          },
          {
            label: "Get Account Summary",
            name: "getAccountSummary",
            description:
              "Returns the account balance of a user for a particular token.",
          },
          {
            label: "Create Withdrawal",
            name: "createWithdrawal",
            description: "Creates a withdrawal request.",
          },
        ],
        default: "getAccountSummary",
      },
    ] as INodeParams[];
    this.credentials = [
      {
        label: "Credential Method",
        name: "credentialMethod",
        type: "options",
        options: [
          {
            label: "Crypto.com API and Secret Key",
            name: "cryptoApi",
          },
        ],
        default: "cryptoApi",
      },
    ] as INodeParams[];
    this.inputParameters = [
      {
        label: "Currency",
        name: "Currency",
        type: "asyncOptions",
        loadMethod: "getSupportedCurrency",
        show: {
          "actions.operation": ["createWithdrawal"],
        },
        default: "BTC",
      },
      {
        label: "Currency",
        name: "CurrencyOptional",
        type: "asyncOptions",
        loadMethod: "getSupportedCurrency",
        optional: true,
        show: {
          "actions.operation": ["getDepositHistory", "getAccountSummary"],
        },
      },
      {
        label: "Amount",
        name: "amount",
        type: "number",
        show: {
          "actions.operation": ["createWithdrawal"],
        },
      },
      {
        label: "Wallet Address",
        name: "walletAddress",
        type: "string",
        show: {
          "actions.operation": ["createWithdrawal"],
        },
      },
      // {
      //   label: "Network",
      //   name: "network",
      //   type: "asyncOptions",
      //   loadMethod: "getSupportedNetwork",
      //   optional: true,
      //   show: {
      //     "actions.operation": ["createWithdrawal"],
      //   },
      // },
    ] as INodeParams[];
  }

  loadMethods = {
    async getSupportedCurrency(
      nodeData: INodeData
    ): Promise<INodeOptionsValue[]> {
      const returnData: INodeOptionsValue[] = [];

      const actionData = nodeData.actions;

      let apiUrl = "";
      if (
        actionData !== undefined &&
        (actionData.network as string) === "test"
      ) {
        apiUrl = "https://uat-api.3ona.co/v2";
      } else {
        apiUrl = "https://api.crypto.com/v2";
      }

      const axiosConfig: AxiosRequestConfig = {
        method: "GET",
        url: `${apiUrl}/public/get-instruments`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios(axiosConfig);
      const responseData = response.data;

      const existArray: string[] = [];
      for (const s of responseData["result"]["instruments"]) {
        const myArray = s.instrument_name.split("_");
        let currency: string = myArray[0];
        if (!existArray.includes(currency)) {
          existArray.push(currency);
          returnData.push({
            label: currency,
            name: currency,
          });
        }
      }

      return returnData;
    },
    async getCountryList(nodeData: INodeData): Promise<INodeOptionsValue[]> {
      return returnCountryList();
    },
    // async getSupportedNetwork(
    //   nodeData: INodeData
    // ): Promise<INodeOptionsValue[]> {
    //   console.log("Start getSupportedNetwork");
    //   const returnData: INodeOptionsValue[] = [];

    //   const actionData = nodeData.actions;
    //   const credentials = nodeData.credentials as ICommonObject;
    //   const apiKey = credentials.apiKey as string; /* User API Key */
    //   const secretKey = credentials.secretKey as string; /* User API Secret */
    //   let queryParameters: ICommonObject = {};

    //   const timestamp = Math.floor(new Date().getTime() / 1000.0); //Current timestamp (milliseconds since the Unix epoch)

    //   let url = "";
    //   let apiUrl = "";

    //   if (
    //     actionData !== undefined &&
    //     (actionData.network as string) === "test"
    //   ) {
    //     apiUrl = "https://uat-api.3ona.co/v2/";
    //   } else {
    //     apiUrl = "https://api.crypto.com/v2/";
    //   }
    //   url = `${apiUrl}private/get-currency-networks`;
    //   let request = {
    //     id: (Math.floor(Math.random() * 100) + 1).toString(),
    //     method: "private/get-currency-networks",
    //     api_key: apiKey,
    //     params: {},
    //     nonce: d,
    //   };
    //   console.log("request:", request);
    //   console.log("apiKey:", apiKey);
    //   console.log("secretKey:", secretKey);
    //   queryParameters["api_key"] = apiKey;
    //   const sig = signRequest(request, apiKey, secretKey);
    //   queryParameters["sig"] = sig;
    //   const axiosConfig: AxiosRequestConfig = {
    //     method: "POST",
    //     url,
    //     params: queryParameters,
    //     paramsSerializer: (params) => serializeQueryParams(params),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   };

    //   try {
    //     const response = await axios(axiosConfig);
    //     const responseData = response.data;
    //     console.log("responseData:", responseData);
    //     for (const c of responseData["currency_map"]) {
    //       for (const n of responseData[c]["network_list"]) {
    //         returnData.push({
    //           label: n,
    //           name: n,
    //         });
    //       }
    //     }
    //   } catch (error) {
    //     console.log(handleErrorMessage(error));
    //   }

    //   console.log("End getSupportedNetwork");
    //   return returnData;
    // },
  };

  async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
    const actionData = nodeData.actions;
    const inputParametersData = nodeData.inputParameters;
    const credentials = nodeData.credentials as ICommonObject;

    if (actionData === undefined || inputParametersData === undefined) {
      throw new Error("Required data missing");
    }

    const operation = actionData.operation as string;
    const apiKey = credentials.apiKey as string; /* User API Key */
    const secretKey = credentials.secretKey as string; /* User API Secret */
    const timestamp = Math.floor(new Date().getTime() / 1000.0); //Current timestamp (milliseconds since the Unix epoch)

    const returnData: ICommonObject[] = [];
    let responseData: any; // tslint:disable-line: no-any

    let apiUrl = "";
    let url = "";
    let queryParameters: ICommonObject = {};
    let queryBody: any = {};
    // let queryBody: ICommonObject = {};
    let method: Method = "POST";

    if (actionData !== undefined && (actionData.network as string) === "test") {
      apiUrl = "https://uat-api.3ona.co/v2/";
    } else {
      apiUrl = "https://api.crypto.com/v2/";
    }

    try {
      if (operation === "getAccountSummary") {
        url = `${apiUrl}private/get-account-summary`;
        let request = {
          id: (Math.floor(Math.random() * 100) + 1).toString(),
          method: "private/get-account-summary",
          params: {},
          nonce: timestamp,
          api_key: apiKey,
        };
        queryBody = signRequest(request, apiKey, secretKey);
      }

      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        params: queryParameters,
        paramsSerializer: (params) => serializeQueryParams(params),
        headers: {
          "Content-Type": "application/json",
        },
        data: queryBody,
      };

      // if (Object.keys(queryBody).length > 0) {
      //   axiosConfig.data = queryBody;
      // }
      console.log("axiosConfig:", axiosConfig);
      const response = await axios(axiosConfig);
      console.log("response:", response);
      responseData = response.data;
      console.log("responseData:", responseData);
    } catch (error) {
      console.log(handleErrorMessage(error));
    }

    if (Array.isArray(responseData)) returnData.push(...responseData);
    else returnData.push(responseData);

    return returnNodeExecutionData(returnData);
  }
}

module.exports = { nodeClass: CryptoPrivate };

const signRequest = (request_body: any, api_key: string, secret: string) => {
  const { id, method, params, nonce } = request_body;

  function isObject(obj: any) {
    return obj !== undefined && obj !== null && obj.constructor == Object;
  }
  function isArray(obj: any) {
    return obj !== undefined && obj !== null && obj.constructor == Array;
  }
  function arrayToString(obj: any) {
    return obj.reduce((a: any, b: any) => {
      return (
        a +
        (isObject(b) ? objectToString(b) : isArray(b) ? arrayToString(b) : b)
      );
    }, "");
  }
  function objectToString(obj: any) {
    if (obj === null) {
      return "";
    } else {
      Object.keys(obj)
        .sort()
        .reduce((a: any, b: any) => {
          return (
            a +
            b +
            (isArray(obj[b])
              ? arrayToString(obj[b])
              : isObject(obj[b])
              ? objectToString(obj[b])
              : obj[b])
          );
        }, "");
    }
  }

  const paramsString = objectToString(params);

  const sigPayload = method + id + api_key + paramsString + nonce;
  return cryptoJs.HmacSHA256(sigPayload, secret).toString(cryptoJs.enc.Hex);
};

const getFormData = (request: any) => {
  const formData = new FormData();
  console.log("request:", request);
  for (const i in request) {
    console.log("i:", i);
    formData.append(i, request[i]);
  }
  return formData;
};
