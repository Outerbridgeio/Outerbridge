import client from './client'

const geOAuth2PopupURL = (credentialId) => client.get('/oauth2', { params: { credentialId } })
const geOAuth2RedirectURL = () => client.get('/oauth2-redirecturl')

export default {
    geOAuth2PopupURL,
    geOAuth2RedirectURL
}
