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
import axios, { AxiosRequestConfig, Method } from "axios";

class CryptoPublic implements INode {
  label: string;
  name: string;
  icon: string;
  type: NodeType;
  description: string;
  version: number;
  incoming: number;
  outgoing: number;
  actions?: INodeParams[];
  inputParameters?: INodeParams[];

  constructor() {
    this.label = "Crypto.com Public";
    this.name = "CryptoPublic";
    this.icon = "Crypto-Logo.png";
    this.type = "action";
    this.description = "Crypto.com Public API";
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
        default: "test",
      },
      {
        label: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            label: "Get Exchange Information",
            name: "getExchangeInfo",
            description:
              "Get current exchange trading rules and symbol information.",
          },
          {
            label: "Get Symbol Price Ticker",
            name: "getTickerPrice",
            description: "Latest price for a symbol or symbols.",
          },
          {
            label: "Get Kline/Candlestick data",
            name: "getKlines",
            description:
              "Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.",
          },
          {
            label: "Get Order Book",
            name: "getOrderBook",
            description: "Get order book.",
          },
          {
            label: "Get Trades Book",
            name: "getTradesBook",
            description: "Get trades book.",
          },
        ],
        default: "getExchangeInfo",
      },
    ] as INodeParams[];
    this.inputParameters = [
      {
        label: "Symbol",
        name: "symbol",
        type: "asyncOptions",
        loadMethod: "getSupportedSymbols",
        show: {
          "actions.operation": ["getKlines", "getOrderBook"],
        },
        default: "BTC_USDT",
      },
      {
        label: "Symbol",
        name: "symbolOptional",
        type: "asyncOptions",
        loadMethod: "getSupportedSymbols",
        optional: true,
        show: {
          "actions.operation": ["getTickerPrice", "getTradesBook"],
        },
      },
      {
        label: "Limit",
        name: "limit",
        type: "number",
        description: "Number of bids and asks to return (up to 150)",
        optional: true,
        show: {
          "actions.operation": ["getOrderBook"],
        },
      },
      {
        label: "Country",
        name: "country",
        type: "asyncOptions",
        loadMethod: "getCountryList",
        optional: true,
        show: {
          "actions.operation": ["getExchangeInfo"],
        },
      },
      {
        label: "Interval",
        name: "interval",
        type: "options",
        options: [
          {
            label: "1 minute",
            name: "1m",
          },
          {
            label: "5 minutes",
            name: "5m",
          },
          {
            label: "15 minutes",
            name: "15m",
          },
          {
            label: "30 minutes",
            name: "30m",
          },
          {
            label: "1 hour",
            name: "1h",
          },
          {
            label: "4 hours",
            name: "4h",
          },
          {
            label: "6 hours",
            name: "6h",
          },
          {
            label: "12 hours",
            name: "12h",
          },
          {
            label: "1 day",
            name: "1D",
          },
          {
            label: "1 week",
            name: "7D",
          },
          {
            label: "2 weeks",
            name: "14D",
          },
          {
            label: "1 month",
            name: "1M",
          },
        ],
        default: "5m",
        show: {
          "actions.operation": ["getKlines"],
        },
      },
    ] as INodeParams[];
  }
  loadMethods = {
    async getSupportedSymbols(
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
      for (const s of responseData["result"]["instruments"]) {
        returnData.push({
          label: s.instrument_name,
          name: s.instrument_name,
        });
      }

      return returnData;
    },
    async getCountryList(nodeData: INodeData): Promise<INodeOptionsValue[]> {
      return returnCountryList();
    },
  };

  async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
    const actionData = nodeData.actions;
    const inputParametersData = nodeData.inputParameters;

    if (actionData === undefined || inputParametersData === undefined) {
      throw new Error("Required data missing");
    }

    const operation = actionData.operation as string;

    const returnData: ICommonObject[] = [];
    let responseData: any; // tslint:disable-line: no-any

    let apiUrl = "";
    let url = "";
    let queryParameters: ICommonObject = {};
    let queryBody: ICommonObject = {};
    let method: Method = "GET";

    if (actionData !== undefined && (actionData.network as string) === "test") {
      apiUrl = "https://uat-api.3ona.co/v2";
    } else {
      apiUrl = "https://api.crypto.com/v2";
    }

    try {
      if (operation === "getExchangeInfo") {
        const country = inputParametersData.country as string;
        url = `${apiUrl}/public/get-instruments`;
        if (country) queryParameters["region"] = country;
        method = "GET";
      } else if (operation === "getTickerPrice") {
        const symbol = inputParametersData.symbolOptional as string;
        url = `${apiUrl}/public/get-ticker`;
        if (symbol) queryParameters["instrument_name"] = symbol;
        method = "GET";
      } else if (operation === "getKlines") {
        const symbol = inputParametersData.symbol as string;
        const interval = inputParametersData.interval as string;
        url = `${apiUrl}/public/get-candlestick`;
        queryParameters["instrument_name"] = symbol;
        queryParameters["timeframe"] = interval;
        method = "GET";
      } else if (operation === "getOrderBook") {
        const symbol = inputParametersData.symbol as string;
        const limit = inputParametersData.limit as string;
        url = `${apiUrl}/public/get-book`;
        queryParameters["instrument_name"] = symbol;
        if (limit) queryParameters["depth"] = limit;
        method = "GET";
      } else if (operation === "getTradesBook") {
        const symbol = inputParametersData.symbolOptional as string;
        url = `${apiUrl}/public/get-trades`;
        if (symbol) queryParameters["instrument_name"] = symbol;
        method = "GET";
      }
      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        params: queryParameters,
        paramsSerializer: (params) => serializeQueryParams(params),
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (Object.keys(queryBody).length > 0) {
        axiosConfig.data = queryBody;
      }

      const response = await axios(axiosConfig);
      responseData = response.data;
    } catch (error) {
      throw handleErrorMessage(error);
    }

    if (Array.isArray(responseData)) returnData.push(...responseData);
    else returnData.push(responseData);

    return returnNodeExecutionData(returnData);
  }
}

module.exports = { nodeClass: CryptoPublic };
