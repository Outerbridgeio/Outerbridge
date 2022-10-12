import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData,
    INodeOptionsValue,
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import {
	handleErrorMessage,
    refreshOAuth2Token,
    returnNodeExecutionData,
    serializeQueryParams
} from '../../src/utils';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

class GoogleSheet implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    credentials?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'GoogleSheet';
		this.name = 'googleSheet';
		this.icon = 'gsheet.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Execute GoogleSheet operations';
		this.incoming = 1;
		this.outgoing = 1;
        this.actions = [
            {
				label: 'Operation',
				name: 'operation',
				type: 'options',
                options: [
					{
						label: 'Create New SpreadSheet',
						name: 'create',
                        description: 'Create a new spreadsheet'
					},
                    {
						label: 'Add Rows',
						name: 'addRows',
                        description: 'Add multiple rows to a spreadsheet'
					},
                    {
						label: 'Get All Values',
						name: 'getAll',
                        description: 'Get all values from a spreadsheet'
					},
                    {
						label: 'Get Values By Range',
						name: 'getRange',
                        description: 'Get values from cells from specified range'
					},
                    {
						label: 'Update Cell',
						name: 'updateCell',
                        description: 'Update single cell in a spreadsheet'
					},
                    {
						label: 'Update Rows',
						name: 'updateRows',
                        description: 'Update multiple rows in a spreadsheet'
					},
                    {
						label: 'Clear Row',
						name: 'clearRow',
                        description: 'Clear the values of a row in a spreadsheet'
					},
                    {
						label: 'Clear Column',
						name: 'clearCol',
                        description: 'Clear the values of a column in a spreadsheet'
					},
                    {
						label: 'Clear By Range',
						name: 'clearRange',
                        description: 'Clear the values in a spreadsheet from specified range'
					},
                ],
                default: 'create',
			},
        ]as INodeParams[];
        this.credentials = [
            {
				label: 'Credential Method',
				name: 'credentialMethod',
				type: 'options',
				options: [
					{
						label: 'Google Sheet OAuth2',
						name: 'googleSheetsOAuth2Api',
					},
				],
				default: 'googleSheetsOAuth2Api',
			},
        ] as INodeParams[];
		this.inputParameters = [
            {
				label: 'Spreadsheet Name',
				name: 'spreadsheetName',
				type: 'string',
                optional: true,
                description: 'Name of the spreadsheet to create. Default to Untitled spreadsheet.',
                show: {
                    'actions.operation': ['create']
                }
			},
            {
				label: 'Spreadsheet',
				name: 'spreadsheetId',
				type: 'asyncOptions',
				loadMethod: 'getAllSheetsFromDrive',
                hide: {
                    'actions.operation': ['create']
                }
			},
            {
				label: 'Sheet Name',
				name: 'sheetName',
				type: 'asyncOptions',
				loadMethod: 'getSheets',
                hide: {
                    'actions.operation': ['create']
                }
			},
            /***
             * Get Values By Range
             */
            {
				label: 'Range',
				name: 'range',
				type: 'string',
                placeholder: 'A1:B2',
                description: 'For example, if the spreadsheet data is: A1=1, B1=2, A2=3, B2=4, then requesting range=A1:B2, returns [[1, 2],[3, 4]]',
                show: {
                    'actions.operation': ['getRange']
                }
			},
            /***
             * Add Rows
             */
            {
				label: 'Row Values',
				name: 'rowValues',
				type: 'json',
                placeholder: '[[1, 2], [3, 4]]',
                description: 'For instance: [[1, 2], [3, 4]] will insert 2 new rows. FIRST row: A1=1, B1=2, and SECOND row: A2=3, B2=4',
                show: {
                    'actions.operation': ['addRows']
                }
			},
            /***
             * Update Rows
             */
            {
				label: 'Range',
				name: 'range',
				type: 'string',
                placeholder: 'A1:B4',
                description: 'A1 notation of the rows to update.',
                show: {
                    'actions.operation': ['updateRows']
                }
			},
            {
				label: 'Row Values',
				name: 'rowValues',
				type: 'json',
                placeholder: '[[1, 2], [3, 4]]',
                description: 'For instance: [[1, 2], [3, 4]] will update FIRST row: A1=1, B1=2, and SECOND row: A2=3, B2=4',
                show: {
                    'actions.operation': ['updateRows']
                }
			},
            /***
             * Update Cell
             */
            {
				label: 'Cell',
				name: 'range',
				type: 'string',
                placeholder: 'A1',
                description: 'A1 notation of the cell to update.',
                show: {
                    'actions.operation': ['updateCell']
                }
			},
            {
				label: 'Cell Value',
				name: 'cellValue',
				type: 'string',
                placeholder: 'New Update Value',
                default: '',
                description: 'New value of the cell',
                show: {
                    'actions.operation': ['updateCell']
                }
			},
            /***
             * Clear
             */
            {
				label: 'Row Number',
				name: 'clearRowNumber',
				type: 'number',
                placeholder: '1',
                description: 'Row (number) to clear the values',
                show: {
                    'actions.operation': ['clearRow']
                }
			},
            {
				label: 'Column Number',
				name: 'clearColNumber',
				type: 'string',
                placeholder: 'A',
                description: 'Column (alphabet) to clear the values',
                show: {
                    'actions.operation': ['clearCol']
                }
			},
            {
				label: 'Range',
				name: 'range',
				type: 'string',
                placeholder: 'A1:B4',
                description: 'A1 notation of the range to clear.',
                show: {
                    'actions.operation': ['clearRange']
                }
			},
		] as INodeParams[];
	};

    loadMethods = {

        async getAllSheetsFromDrive(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = [];

            const credentials = nodeData.credentials;

            if (credentials === undefined) {
                return returnData;
            }

            // Get credentials
            const token_type = credentials!.token_type as string;
            const access_token = credentials!.access_token as string;
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`,
            };

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'`,
                headers
            }

            let maxRetries = 5;
            do {
                try {
                    const response = await axios(axiosConfig);
                    const responseData = response.data;
                    for (const file of (responseData.files || [])) {
                        returnData.push({
                            label: file.name as string,
                            name: file.id as string,
                        });
                    }
                    return returnData;
                } catch(e) {
                    // Access_token expired
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials);
                        headers['Authorization'] = `${token_type} ${access_token}`;
                        continue;                    
                    }
                    return returnData;
                }
            } while (--maxRetries);

            return returnData;
        },

        async getSheets(nodeData: INodeData): Promise<INodeOptionsValue[]> {
            const returnData: INodeOptionsValue[] = [];

            const credentials = nodeData.credentials;
            const inputParameters = nodeData.inputParameters;

            if (credentials === undefined || inputParameters === undefined) {
                return returnData;
            }

            const spreadsheetId = inputParameters.spreadsheetId as string;
            const token_type = credentials!.token_type as string;
            const access_token = credentials!.access_token as string;
            const headers: AxiosRequestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`,
            };

            if (spreadsheetId === undefined || token_type === undefined || access_token === undefined ) {
                return returnData;
            }

            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
                headers
            }

            let maxRetries = 5;
            do {
                try {
                    const response = await axios(axiosConfig);
                    const responseData = response.data;
                    for (const sheet of responseData.sheets!) {
                        if (sheet.properties!.sheetType !== 'GRID') continue;
                        returnData.push({
                            label: sheet.properties!.title as string,
                            name: sheet.properties!.title as string,
                        });
                    }
                    return returnData;
                } catch(e) {
                    // Access_token expired
                    if (e.response && e.response.status === 401) {
                        const { access_token } = await refreshOAuth2Token(credentials);
                        headers['Authorization'] = `${token_type} ${access_token}`;
                        continue;                    
                    }
                    return returnData;
                }
            } while (--maxRetries);

            return returnData;
        },
    }

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

        const actionsData = nodeData.actions;
        const credentials = nodeData.credentials;
        const inputParametersData = nodeData.inputParameters;

		if (actionsData === undefined) {
            throw new Error('Required data missing!');
        }

        if (credentials === undefined) {
            throw new Error('Missing credential!');
        }

        // Get operation
        const operation = actionsData.operation as string;

        // Get credentials
        const token_type = credentials!.token_type as string;
        const access_token = credentials!.access_token as string;

		const returnData: ICommonObject[] = [];
        let responseData: any;
		
        let url = '';
        const queryParameters: ICommonObject = {};
        let queryBody: any = {};
        let method: Method = 'POST';
		const headers: AxiosRequestHeaders = {
			'Content-Type': 'application/json',
            'Authorization': `${token_type} ${access_token}`,
		};

        const spreadsheetId = inputParametersData?.spreadsheetId as string;
        const sheetName = inputParametersData?.sheetName as string;
        const rowValues = inputParametersData?.rowValues as string;

        let maxRetries = 5;
        let oAuth2RefreshedData: any = {};
        do {
            try {
                if (operation === 'create') {
                    url = 'https://sheets.googleapis.com/v4/spreadsheets';
                    const spreadsheetName = inputParametersData?.spreadsheetName as string;
                    if (spreadsheetName) {
                        queryBody['properties'] = {
                            title: spreadsheetName
                        };
                    }
                }
                else if (operation === 'addRows') {
                    const rows = JSON.parse(rowValues.replace(/\s/g, ''))
                    const range = sheetName;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append`;
                    queryParameters['valueInputOption'] = 'USER_ENTERED';
                    queryParameters['insertDataOption'] = 'INSERT_ROWS';
                    queryBody['values'] = rows;
                }
                else if (operation === 'getAll') {
                    method = 'GET';
                    const range = sheetName;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
                }
                else if (operation === 'getRange') {
                    method = 'GET';
                    const range = inputParametersData?.range as string;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
                }
                else if (operation === 'updateCell') {
                    method = 'PUT';
                    const range = inputParametersData?.range as string;
                    const cellValue = inputParametersData?.cellValue as string;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
                    queryParameters['valueInputOption'] = 'USER_ENTERED';
                    queryBody['values'] = [[cellValue]];
                }
                else if (operation === 'updateRows') {
                    method = 'PUT';
                    const rows = JSON.parse(rowValues.replace(/\s/g, ''))
                    const range = inputParametersData?.range as string;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
                    queryParameters['valueInputOption'] = 'USER_ENTERED';
                    queryBody['values'] = rows;
                }
                else if (operation === 'clearRow') {
                    const clearRowNumber = inputParametersData?.clearRowNumber as number;
                    const range = `${sheetName}!${clearRowNumber}:${clearRowNumber}`;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
                }
                else if (operation === 'clearCol') {
                    const clearColNumber = inputParametersData?.clearColNumber as string;
                    const range = `${sheetName}!${clearColNumber}:${clearColNumber}`;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
                }
                else if (operation === 'clearRange') {
                    const range = inputParametersData?.range as string;
                    url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
                }

                const axiosConfig: AxiosRequestConfig = {
                    method,
                    url,
                    headers
                }

                if (Object.keys(queryParameters).length > 0) {
                    axiosConfig.params = queryParameters;
                    axiosConfig.paramsSerializer = params => serializeQueryParams(params);
                }

                if (Object.keys(queryBody).length > 0) {
                    axiosConfig.data = queryBody;
                }

                const response = await axios(axiosConfig);
                responseData = response.data;
                break;

            } catch (error) {
                // Access_token expired
                if (error.response && error.response.status === 401) {
                    const { access_token, expires_in } = await refreshOAuth2Token(credentials);
                    headers['Authorization'] = `${token_type} ${access_token}`;
                    oAuth2RefreshedData = { access_token, expires_in };
                    continue;
                } 
                throw handleErrorMessage(error);
            }
        } while (--maxRetries);

        if (maxRetries <= 0) {
			throw new Error('Error executing GoogleSheet node. Max retries limit was reached.',);
		}

        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        } else {
            returnData.push(responseData);
        }
        
        return returnNodeExecutionData(returnData, oAuth2RefreshedData);
	}
}

module.exports = { nodeClass: GoogleSheet }