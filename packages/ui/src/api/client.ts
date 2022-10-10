import axios from 'axios'
import { baseURL } from 'store/constant'

export const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})
