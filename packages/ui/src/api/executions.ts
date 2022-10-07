import { client } from './client';
import { IExecution } from 'outerbridge-components';

export const getAllExecutions = () => client.get('/executions');

export const getSpecificExecution = (shortId: string) => client.get(`/executions/${shortId}`);

export const createNewExecution = (body: IExecution) => client.post(`/executions`, body);

export const updateExecution = (shortId: string, body: IExecution) => client.put(`/executions/${shortId}`, body);

export const deleteExecution = (shortId: string) => client.delete(`/executions/${shortId}`);
