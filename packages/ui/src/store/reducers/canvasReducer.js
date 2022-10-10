// action - state management
import * as actionTypes from '../actions'

export const initialState = {
    removeEdgeId: '',
    isDirty: false,
    workflow: null
}

// ==============================|| CANVAS REDUCER ||============================== //

const canvasReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REMOVE_EDGE:
            return {
                ...state,
                removeEdgeId: action.edgeId
            }
        case actionTypes.SET_DIRTY:
            return {
                ...state,
                isDirty: true
            }
        case actionTypes.REMOVE_DIRTY:
            return {
                ...state,
                isDirty: false
            }
        case actionTypes.SET_WORKFLOW:
            return {
                ...state,
                workflow: action.workflow
            }
        default:
            return state
    }
}

export default canvasReducer
