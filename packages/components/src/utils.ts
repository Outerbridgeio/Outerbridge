import {
    ICommonObject,
	INodeExecutionData,
	IWebhookNodeExecutionData
} from './Interface';

export const numberOrExpressionRegex = '^(\\d+\\.?\\d*|{{.*}})$'; //return true if string consists only numbers OR expression {{}}
export const notEmptyRegex = '(.|\\s)*\\S(.|\\s)*'; //return true if string is not empty or blank

/**
 * Return responses as INodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @returns {INodeExecutionData[]}
 */
 export function returnNodeExecutionData(responseData: ICommonObject | ICommonObject[]): INodeExecutionData[] {
	const returnData: INodeExecutionData[] = [];

	if (!Array.isArray(responseData)) {
		responseData = [responseData];
	}

	responseData.forEach((data) => {
		const obj = { data } as ICommonObject;

		if (data.attachments) {
			if (Array.isArray(data.attachments) && data.attachments.length) 
				obj.attachments = data.attachments;
			else if (!Array.isArray(data.attachments))
				obj.attachments = data.attachments;
		}

		if (data.html) obj.html = data.html;
		
		returnData.push(obj);
	});

	return returnData;
}

/**
 * Return responses as INodeExecutionData
 *
 * @export
 * @param {(ICommonObject | ICommonObject[])} responseData
 * @returns {IWebhookNodeExecutionData[]}
 */
 export function returnWebhookNodeExecutionData(responseData: ICommonObject | ICommonObject[], webhookReturnResponse?: string): IWebhookNodeExecutionData[] {
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
 * @param {(any)} params
 * @returns {any[]}
 */
export function serializeQueryParams(params: any) {
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
			val.forEach((v, i) => convertPart(`${key}[${i}]`, v))
		else
			convertPart(key, val)
	})

	return parts.join('&');
}

/**
 * Handle error from try catch
 *
 * @export
 * @param {(any)} error
 * @returns {any}
 */
export function handleErrorMessage(error: any) {
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