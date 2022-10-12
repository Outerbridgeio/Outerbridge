import axios from 'axios'
import { constant } from 'store'

export const client = axios.create({
    baseURL: `${constant.baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})
