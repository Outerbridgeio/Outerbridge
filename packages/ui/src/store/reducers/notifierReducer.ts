import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, enqueueSnackbar, closeSnackbar, removeSnackbar } from '../actions'
import { OptionsObject, SnackbarKey } from 'notistack'

export const initialState: {
    notifications: {
        key: SnackbarKey
        message: string
        options: OptionsObject
        dismissAll?: boolean
        dismissed?: boolean
    }[]
} = {
    notifications: []
}

export const notifierReducer = (
    state = initialState,
    action: ReturnType<typeof enqueueSnackbar> | ReturnType<typeof closeSnackbar> | ReturnType<typeof removeSnackbar>
) => {
    switch (action.type) {
        case ENQUEUE_SNACKBAR:
            return {
                ...state,
                notifications: [...state.notifications, { ...action.notification }]
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
