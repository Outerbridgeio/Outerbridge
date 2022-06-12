import {
    ICommonObject,
	INodeExecutionData,
	IWebhookNodeExecutionData
} from './Interface';

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
		returnData.push({ data });
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