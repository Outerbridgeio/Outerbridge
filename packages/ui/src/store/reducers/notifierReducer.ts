import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, enqueueSnackbar, closeSnackbar, removeSnackbar } from '../actions'

export const initialState: { notifications: { key: string }[] } = {
    notifications: []
}

type EnqueueSnackbarR = ReturnType<typeof enqueueSnackbar>
type CloseSnackbarR = ReturnType<typeof closeSnackbar>
type RemoveSnackbarR = ReturnType<typeof removeSnackbar>

export const notifierReducer = (state = initialState, action: EnqueueSnackbarR | CloseSnackbarR | RemoveSnackbarR) => {
    switch (action.type) {
        case ENQUEUE_SNACKBAR:
            return {
                ...state,
                notifications: [...state.notifications, action.notification]
            }

        case CLOSE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    action.dismissAll || notification.key === action.key ? { ...notification, dismissed: true } : { ...notification }
                )
            }

        case REMOVE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.filter((notification) => notification.key !== action.key)
            }

        default:
            return state
    }
}
