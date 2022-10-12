import { SHOW_CONFIRM, HIDE_CONFIRM } from '../actions'

export const initialState = {
    show: false,
    title: '',
    description: '',
    confirmButtonName: 'OK',
    cancelButtonName: 'Cancel'
}

export const dialogReducer = (
    state = initialState,
    action: { type: typeof SHOW_CONFIRM; payload: typeof initialState } | { type: typeof HIDE_CONFIRM }
) => {
    switch (action.type) {
        case SHOW_CONFIRM:
            return {
                show: true,
                title: action.payload.title,
                description: action.payload.description,
                confirmButtonName: action.payload.confirmButtonName,
                cancelButtonName: action.payload.cancelButtonName
            }
        case HIDE_CONFIRM:
            return initialState
        default:
            return state
    }
}
