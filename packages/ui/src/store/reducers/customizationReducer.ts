// project imports
import config from 'config'

// action - state management
import { MENU_OPEN, SET_MENU, SET_FONT_FAMILY, SET_BORDER_RADIUS } from '../actions'

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true
}

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

export const customizationReducer = (
    state = initialState,
    action:
        | { type: typeof MENU_OPEN; id: string }
        | { type: typeof SET_MENU; opened: boolean }
        | { type: typeof SET_FONT_FAMILY; fontFamily: string }
        | { type: typeof SET_BORDER_RADIUS; borderRadius: string }
) => {
    let id
    switch (action.type) {
        case MENU_OPEN:
            id = action.id
            return {
                ...state,
                isOpen: [id]
            }
        case SET_MENU:
            return {
                ...state,
                opened: action.opened
            }
        case SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            }
        case SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            }
        default:
            return state
    }
}
