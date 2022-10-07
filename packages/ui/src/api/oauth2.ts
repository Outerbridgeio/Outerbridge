import { client } from './client';

export const geOAuth2PopupURL = (credentialId: string) => client.get('/oauth2', { params: { credentialId } });
export const geOAuth2RedirectURL = () => client.get('/oauth2-redirecturl');
