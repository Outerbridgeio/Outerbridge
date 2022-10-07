import { client } from './client';
import { IWorkflow } from 'outerbridge-components';
import { ITestWorkflowBody } from 'outerbridge';

export const getAllWorkflows = () => client.get('/workflows');

export const getSpecificWorkflow = (shortId: string) => client.get(`/workflows/${shortId}`);

export const createNewWorkflow = (body: IWorkflow) => client.post(`/workflows`, body);

export const updateWorkflow = (shortId: string, body: IWorkflow) => client.put(`/workflows/${shortId}`, body);

export const deployWorkflow = (shortId: string, body: { halt: boolean }) => client.post(`/workflows/deploy/${shortId}`, body || {});

export const testWorkflow = (startingNodeId: string, body: ITestWorkflowBody) => client.post(`/workflows/test/${startingNodeId}`, body);

export const deleteWorkflow = (shortId: string) => client.delete(`/workflows/${shortId}`);
