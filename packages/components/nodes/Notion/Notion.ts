import {
    ICommonObject,
    INode,
    INodeData,
    INodeExecutionData,
    INodeParams,
    NodeType,
  } from '../../src/Interface';
  import { handleErrorMessage, returnNodeExecutionData } from '../../src/utils';
  import axios, { AxiosRequestConfig, Method } from 'axios';
  
  class Notion implements INode {
    label: string;
    name: string;
    type: NodeType;
    description?: string;
    version: number;
    icon: string;
    incoming: number;
    outgoing: number;
    actions?: INodeParams[];
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];
    constructor() {
      this.label = 'Notion';
      this.name = 'notion';
      this.icon = 'notion.svg';
      this.type = 'action';
      this.version = 1.0;
      this.description = 'Work with Notion page, database or block';
      this.incoming = 1;
      this.outgoing = 1;
      this.actions = [
        {
          label: 'Target',
          name: 'target',
          type: 'options',
          options: [
            {
              label: 'Search all pages',
              name: 'searchTarget',
            },
            {
              label: 'Page',
              name: 'pageTarget',
            },
            {
              label: 'Database',
              name: 'databaseTarget',
            },
            {
              label: 'Block',
              name: 'blockTarget',
            },
          ],
        },
        {
          label: 'Page Operations',
          name: 'pageOperation',
          type: 'options',
          options: [
            {
              label: 'Get Page',
              name: 'getPage',
            },
            {
              label: 'Create Page',
              name: 'createPage',
            },
            {
              label: 'Update Page',
              name: 'updatePage',
            },
            {
              label: 'Delete Page',
              name: 'deletePage',
            },
          ],
          default: 'Get Page',
          show: {
            'actions.target': ['pageTarget'],
          },
        },
        {
          label: 'Database Operations',
          name: 'databaseOperation',
          type: 'options',
          options: [
            {
              label: 'Get Database',
              name: 'getDatabase',
            },
            {
              label: 'Create Database',
              name: 'createDatabase',
            },
            {
              label: 'Update Database',
              name: 'updateDatabase',
            },
            {
              label: 'Query Database',
              name: 'queryDatabase',
            },
          ],
          default: 'Get Database',
          show: {
            'actions.target': ['databaseTarget'],
          },
        },
        {
          label: 'Block Operations',
          name: 'blockOperation',
          type: 'options',
          options: [
            {
              label: 'Get Block',
              name: 'getBlock',
            },
            {
              label: 'Update Block',
              name: 'updateBlock',
            },
            {
              label: 'Get Block Children',
              name: 'getBlockChildren',
            },
            {
              label: 'Append Block Children',
              name: 'appendBlockChildren',
            },
            {
              label: 'Delete Block',
              name: 'deleteBlock',
            },
          ],
          default: 'Get Block',
          show: {
            'actions.target': ['blockTarget'],
          },
        },
      ] as INodeParams[];
      this.inputParameters = [
        {
          label: 'Notion Version',
          name: 'notionVersion',
          type: 'string',
          optional: false,
          description: 'Notion Version to be used in the Headers of the request',
          default: '2022-06-28'
        },
        {
          label: 'Page ID',
          name: 'pageID',
          type: 'string',
          optional: false,
          description: 'ID of the page',
          show: {
            'actions.pageOperation': ['getPage', 'updatePage', 'deletePage'],
          },
        },
        {
          label: 'Database ID',
          name: 'databaseID',
          type: 'string',
          optional: false,
          description: 'ID of the database',
          show: {
            'actions.databaseOperation': [
              'getDatabase',
              'updateDatabase',
              'queryDatabase',
            ],
          },
        },
        {
          label: 'Block ID',
          name: 'blockID',
          type: 'string',
          optional: false,
          description: 'ID of the block',
          show: {
            'actions.blockOperation': [
              'getBlock',
              'updateBlock',
              'deleteBlock',
              'appendBlockChildren',
              'getBlockChildren',
            ],
          },
        },
        {
          label: 'Query String',
          name: 'queryString',
          type: 'string',
          optional: false,
          description:
            'Name of the page (with your Notion Integration) to be searched',
          show: {
            'actions.target': ['searchTarget'],
          },
        },
        {
          label: 'Body',
          name: 'pageBody',
          type: 'json',
          description:
            'Refer to the <a target"_blank" href="https://developers.notion.com/reference/page">Notion API docs</a> on how to structure the request body for page',
          show: {
            'actions.pageOperation': ['createPage', 'updatePage'],
          },
          placeholder: `{
            "parent": {
                "database_id": "{{databaseID}}"
            },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": { "content": "New Media Article" }
                        }
                    ]
                }
            }
        }`,
          optional: false,
        },
        {
          label: 'Body',
          name: 'databaseBody',
          type: 'json',
          description:
            'Refer to the <a target="_blank" href="https://developers.notion.com/reference/database">Notion API docs</a> on how to structure the request body for database',
          show: {
            'actions.databaseOperation': [
              'createDatabase',
              'updateDatabase',
              'queryDatabase',
            ],
          },
          placeholder: `{
            "parent": {
                "type": "page_id",
                "page_id": "{{pageID}}"
            },
            "title": [
                {
                    "type": "text",
                    "text": { "content": "Grocery List", } }
            ],
            "properties": {
                "Name": {
                    "title": {}
                }
            }
        }`,
          optional: false,
        },
        {
          label: 'Body',
          name: 'blockBody',
          type: 'json',
          description:
            'Refer to the <a target="_blank" href="https://developers.notion.com/reference/block">Notion API docs</> on how to structure the request body for block',
          show: {
            'actions.blockOperation': ['updateBlock', 'appendBlockChildren'],
          },
          placeholder: `{
            "paragraph": {
                "rich_text": [{
                    "type": "text", 
                    "text": { "content": "hello to you"}
                }]
            }
        }`,
          optional: false,
        },
      ] as INodeParams[];
      this.credentials = [
        {
          label: 'Credential Method',
          name: 'credentialMethod',
          type: 'options',
          options: [
            {
              label: 'Notion Integration Token',
              name: 'notionApi',
            },
          ],
          default: 'notionApi',
        },
      ] as INodeParams[];
    }
  
    async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {
      const actionsData = nodeData.actions;
      const inputParameters = nodeData.inputParameters;
      const credentials = nodeData.credentials;
  
      if (
        actionsData === undefined ||
        credentials === undefined ||
        inputParameters === undefined
      ) {
        throw new Error('Required information missing');
      }
  
      const pageId = inputParameters.pageID;
      const databaseId = inputParameters.databaseID;
      const blockId = inputParameters.blockID;
  
      const returnData: ICommonObject[] = [];
  
      const pageOperation = actionsData.pageOperation as string;
      const databaseOperation = actionsData.databaseOperation as string;
      const blockOperation = actionsData.blockOperation as string;
  
      const target = actionsData.target as string;
      const bearerToken = credentials.integrationToken as string;
  
      //Request Body
      const pageBody = inputParameters.pageBody as string;
      const databaseBody = inputParameters.databaseBody as string;
      const blockBody = inputParameters.blockBody as string;
  
      //Notion-Version for Headers
      const notionVersion = inputParameters.notionVersion as string;
  
      //Search Data
      const queryString = inputParameters.queryString as string;
  
      let responseData: any;
      let requestPageBody,
        requestDatabaseBody,
        requestBlockBody: any = {};
  
      //JSON input params body
      if (pageBody) {
        requestPageBody = JSON.parse(pageBody.replace(/\s/g, ' '));
      }
      if (databaseBody) {
        requestDatabaseBody = JSON.parse(databaseBody.replace(/\s/g, ' '));
      }
      if (blockBody) {
        requestBlockBody = JSON.parse(blockBody.replace(/\s/g, ' '));
      }
  
      //Search Endpoint
      if (target === 'searchTarget') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'POST' as Method,
            url: `https://api.notion.com/v1/search`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
            data: {
              query: `${queryString}`,
              sort: {
                direction: 'ascending',
                timestamp: 'last_edited_time',
              },
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      //Page Endpoints
  
      if (pageOperation === 'getPage') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'GET' as Method,
            url: `https://api.notion.com/v1/pages/${pageId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (pageOperation === 'createPage') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'POST' as Method,
            url: `https://api.notion.com/v1/pages`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestPageBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (pageOperation === 'updatePage') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'PATCH' as Method,
            url: `https://api.notion.com/v1/pages/${pageId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestPageBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (pageOperation === 'deletePage') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'DELETE' as Method,
            url: `https://api.notion.com/v1/blocks/${pageId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      //Database Endpoints
      if (databaseOperation === 'getDatabase') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'GET' as Method,
            url: `https://api.notion.com/v1/databases/${databaseId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (databaseOperation === 'createDatabase') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'POST' as Method,
            url: `https://api.notion.com/v1/databases`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestDatabaseBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (databaseOperation === 'updateDatabase') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'PATCH' as Method,
            url: `https://api.notion.com/v1/databases/${databaseId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestDatabaseBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (databaseOperation === 'queryDatabase') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'POST' as Method,
            url: `https://api.notion.com/v1/databases/${databaseId}/query`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestDatabaseBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      //Block Endpoints
      if (blockOperation === 'getBlock') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'GET' as Method,
            url: `https://api.notion.com/v1/blocks/${blockId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (blockOperation === 'updateBlock') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'PATCH' as Method,
            url: `https://api.notion.com/v1/blocks/${blockId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestBlockBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (blockOperation === 'getBlockChildren') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'GET' as Method,
            url: `https://api.notion.com/v1/blocks/${blockId}/children`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (blockOperation === 'appendBlockChildren') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'PATCH' as Method,
            url: `https://api.notion.com/v1/blocks/${blockId}/children`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          axiosConfig.data = requestBlockBody;
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (blockOperation === 'deleteBlock') {
        try {
          const axiosConfig: AxiosRequestConfig = {
            method: 'DELETE' as Method,
            url: `https://api.notion.com/v1/blocks/${blockId}`,
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Notion-Version': `${notionVersion}`,
            },
          };
          const response = await axios(axiosConfig);
          responseData = response.data;
        } catch (error) {
          throw handleErrorMessage(error);
        }
      }
  
      if (Array.isArray(responseData)) {
        returnData.push(...responseData);
      } else {
        returnData.push(responseData);
      }
  
      return returnNodeExecutionData(returnData);
    }
  }
  
  module.exports = { nodeClass: Notion };
  