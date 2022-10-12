import { combineReducers } from 'redux'

// reducer import
import { customizationReducer } from './customizationReducer'
import { canvasReducer } from './canvasReducer'
import { notifierReducer } from './notifierReducer'
import { dialogReducer } from './dialogReducer'

// ==============================|| COMBINE REDUCER ||============================== //

export const reducer = combineReducers({
    customization: customizationReducer,
    canvas: canvasReducer,
    notifier: notifierReducer,
    dialog: dialogReducer
})
