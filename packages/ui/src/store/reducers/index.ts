import { combineReducers } from 'redux'

// reducer import
import { customizationReducer } from './customizationReducer'
import { canvasReducer } from './canvasReducer'
import { notifierReducer } from './notifierReducer'
import { dialogReducer } from './dialogReducer'

// ==============================|| COMBINE REDUCER ||============================== //

export const combinedReducers = combineReducers({
    customization: customizationReducer,
    canvas: canvasReducer,
    notifier: notifierReducer,
    dialog: dialogReducer
})

export * as dialog from './dialogReducer'
export * as customization from './customizationReducer'
