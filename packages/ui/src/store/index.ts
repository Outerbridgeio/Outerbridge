import { legacy_createStore as createStore } from 'redux'
import { combinedReducers } from './reducers'
import { TypedUseSelectorHook, useDispatch as useDispatch_, useSelector as useSelector_ } from 'react-redux'

// ==============================|| REDUX - MAIN STORE ||============================== //

export const store = createStore(combinedReducers)

// https://react-redux.js.org/using-react-redux/usage-with-typescript
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useDispatch: () => AppDispatch = useDispatch_
export const useSelector: TypedUseSelectorHook<RootState> = useSelector_

export * as actions from './actions'
export * as constant from './constant'
export * as context from './context'
export * as reducer from './reducers'
