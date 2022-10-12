import { legacy_createStore as createStore } from 'redux'
import { reducer } from './reducers'

// ==============================|| REDUX - MAIN STORE ||============================== //

export const store = createStore(reducer)
export const persister = 'Free'

export * as actions from './actions'
export * as constant from './constant'
