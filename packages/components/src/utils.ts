import axios, { AxiosRequestConfig } from 'axios';
import ClientOAuth2 from 'client-oauth2';
import FormData from "form-data";
import {
    ICommonObject,
	INodeExecutionData,
	IWebhookNodeExecutionData,
	IOAuth2RefreshResponse
} from './Interface';
import * as fs from 'fs';
import * as path from 'path';

export const OAUTH2_REFRESHED = 'oAuth2RefreshedData';
export const numberOrExpressionRegex = '^(\\d+\\.?\\d*|{{.*}})$'; //return true if string consists only numbers OR expression {{}}
export const notEmptyRegex = '(.|\\s)*\\S(.|\\s)*'; //return true if string is not empty or blank

/**
 * Return responses as INodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @returns {INodeExecutionData[]}
 */
export function returnNodeExecutionData(
	responseData: ICommonObject | ICommonObject[],
	oAuth2RefreshedData?: any
): INodeExecutionData[] {
	const returnData: INodeExecutionData[] = [];

	if (!Array.isArray(responseData)) {
		responseData = [responseData];
	}

	responseData.forEach((data) => {
		const obj = { data } as ICommonObject;

		if (data && data.attachments) {
			if (Array.isArray(data.attachments) && data.attachments.length) 
				obj.attachments = data.attachments;
			else if (!Array.isArray(data.attachments))
				obj.attachments = data.attachments;
		}

		if (data && data.html)
			obj.html = data.html;

		if (oAuth2RefreshedData && Object.keys(oAuth2RefreshedData).length > 0)
			obj[OAUTH2_REFRESHED] = oAuth2RefreshedData;
		
		returnData.push(obj);
	});

	return returnData;
}

/**
 * Return responses as IWebhookNodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @param {string} webhookReturnResponse
 * @returns {IWebhookNodeExecutionData[]}
 */
export function returnWebhookNodeExecutionData(
	responseData: ICommonObject | ICommonObject[], 
	webhookReturnResponse?: string
): IWebhookNodeExecutionData[] {
	const returnData: IWebhookNodeExecutionData[] = [];

	if (!Array.isArray(responseData)) {
		responseData = [responseData];
	}

	responseData.forEach((data) => {
		const returnObj = {
			data,
		} as IWebhookNodeExecutionData;

		if (webhookReturnResponse) returnObj.response = webhookReturnResponse;

		returnData.push(returnObj);
	});

	return returnData;
}

/**
 * Serialize axios query params
 *
 * @export
 * @param {any} params
 * @param {boolean} skipIndex // Set to true if you want same params to be: param=1&param=2 instead of: param[0]=1&param[1]=2
 * @returns {string}
 */
export function serializeQueryParams(params: any, skipIndex?: boolean): string {
	const parts: any[] = [];
				
	const encode = (val: string) => {
		return encodeURIComponent(val).replace(/%3A/gi, ':')
			.replace(/%24/g, '$')
			.replace(/%2C/gi, ',')
			.replace(/%20/g, '+')
			.replace(/%5B/gi, '[')
			.replace(/%5D/gi, ']');
	}

	const convertPart = (key: string, val: any) => {
		if (val instanceof Date)
			val = val.toISOString()
		else if (val instanceof Object)
			val = JSON.stringify(val)

		parts.push(encode(key) + '=' + encode(val));
	}

	Object.entries(params).forEach(([key, val]) => {
		if (val === null || typeof val === 'undefined')
			return

		if (Array.isArray(val))
			val.forEach((v, i) => convertPart(`${key}${skipIndex ? '' : `[${i}]`}`, v))
		else
			convertPart(key, val)
	})

	return parts.join('&');
}

/**
 * Handle error from try catch
 *
 * @export
 * @param {any} error
 * @returns {string}
 */
export function handleErrorMessage(error: any): string {
	let errorMessage = '';

	if(error.message){
		errorMessage += error.message + '. ';
	}

	if(error.response && error.response.data){
		if (error.response.data.error) {
			if (typeof error.response.data.error === 'object')
				errorMessage += JSON.stringify(error.response.data.error) + '. ';
			else if (typeof error.response.data.error === 'string')
				errorMessage += error.response.data.error + '. ';
		}
		else if (error.response.data.msg) errorMessage += error.response.data.msg + '. ';
		else if (error.response.data.Message) errorMessage += error.response.data.Message + '. ';
		else if (typeof error.response.data === 'string') errorMessage += error.response.data + '. ';
	}

	if (!errorMessage) errorMessage = 'Unexpected Error.'

	return errorMessage;
}

/**
 * Refresh access_token for oAuth2 apps
 *
 * @export
 * @param {ICommonObject} credentials
 */
export async function refreshOAuth2Token(credentials: ICommonObject) {

	const accessTokenUrl = credentials!.accessTokenUrl as string;
	const authUrl = credentials!.authUrl as string;
	const client_id = credentials!.clientID as string;
	const client_secret = credentials!.clientSecret as string;
	const refreshToken = credentials!.refresh_token as string;
	const accessToken = credentials!.access_token as string;
	const tokenType = credentials!.token_type as string;

	return await refreshThroughClient(
		client_id,
		client_secret, 
		accessTokenUrl, 
		authUrl,
		accessToken,
		refreshToken,
		tokenType,
	)
}

const refreshThroughClient = async(
	client_id: string,
	client_secret: string, 
	accessTokenUrl: string, 
	authUrl: string,
	accessToken: string,
	refreshToken: string,
	tokenType: string,
) => {
	try {

		const oAuth2Parameters = {
			clientId: client_id,
			clientSecret: client_secret,
			accessTokenUri: accessTokenUrl,
			authorizationUri: authUrl,
		};

		const oAuthObj = new ClientOAuth2(oAuth2Parameters);
		const { data } = await oAuthObj.credentials.getToken();

		const tokenInstance = oAuthObj.createToken(accessToken, refreshToken, tokenType, data);
		const newToken = await tokenInstance.refresh();

		const { access_token, expires_in } = newToken.data;
		
		const returnItem: IOAuth2RefreshResponse = {
			access_token,
			expires_in
		}
		return returnItem;

	} catch (e) {
		return await refreshThroughHttpBody(
			client_id,
			client_secret, 
			accessTokenUrl, 
			refreshToken
		);
	}
}

const refreshThroughHttpBody = async(
	client_id: string,
	client_secret: string, 
	accessTokenUrl: string, 
	refreshToken: string,
) => {
	const method = 'POST';
	const axiosConfig: AxiosRequestConfig = {
		method,
		url: accessTokenUrl,
		data: {
			grant_type: 'refresh_token',
			client_id,
			client_secret,
			refresh_token: refreshToken
		},
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	}

	try {
		const response = await axios(axiosConfig);
		const refreshedTokenResp = response.data;
		
		const returnItem: IOAuth2RefreshResponse = {
			access_token: refreshedTokenResp.access_token,
			expires_in: refreshedTokenResp.expires_in,
		}
		
		return returnItem;

	} catch(e) {
		return await refreshThroughHttpHeader(
			client_id,
			client_secret, 
			accessTokenUrl, 
			refreshToken
		);
	}
}

const refreshThroughHttpHeader = async(
	client_id: string,
	client_secret: string, 
	accessTokenUrl: string, 
	refreshToken: string,
) => {
	const method = 'POST';
	const formData = new FormData();
	formData.append("grant_type", 'refresh_token');
	formData.append("refresh_token", refreshToken);

	const axiosConfig: AxiosRequestConfig = {
		method,
		url: accessTokenUrl,
		data: formData,
		headers: {
			...formData.getHeaders(),
			'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
		},
	}

	try {
		const response = await axios(axiosConfig);
		const refreshedTokenResp = response.data;
		
		const returnItem: IOAuth2RefreshResponse = {
			access_token: refreshedTokenResp.access_token,
			expires_in: refreshedTokenResp.expires_in,
		}
		
		return returnItem;

	} catch(e) {
		throw handleErrorMessage(e);
	}
}

/**
 * Returns the path of node modules package
 * @param {string} packageName
 * @returns {string}
 */
 export const getNodeModulesPackagePath = (packageName: string): string => {
    const checkPaths = [
        path.join(__dirname, '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', 'node_modules', packageName),
        path.join(__dirname, '..', '..', '..', 'node_modules', packageName),
		path.join(__dirname, '..', '..', '..', '..','node_modules', packageName),
		path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', packageName),
    ];
    for (const checkPath of checkPaths) {
        if (fs.existsSync(checkPath)) {
            return checkPath;
        }
    }
    return '';
}