import { legacy_createStore as createStore } from 'redux'
import { combinedReducers } from './reducers'

// ==============================|| REDUX - MAIN STORE ||============================== //

export const store = createStore(combinedReducers)

export * as actions from './actions'
export * as constant from './constant'
export * as context from './context'
export * as reducer from './reducers'
