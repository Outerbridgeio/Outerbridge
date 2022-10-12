import { OptionsObject, SnackbarKey } from 'notistack'
// action - customization reducer
export const SET_MENU = '@customization/SET_MENU'
export const MENU_TOGGLE = '@customization/MENU_TOGGLE'
export const MENU_OPEN = '@customization/MENU_OPEN'
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY'
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS'

// action - canvas reducer
export const REMOVE_EDGE = '@canvas/REMOVE_EDGE'
export const SET_DIRTY = '@canvas/SET_DIRTY'
export const REMOVE_DIRTY = '@canvas/REMOVE_DIRTY'
export const SET_WORKFLOW = '@canvas/SET_WORKFLOW'

// action - notifier reducer
export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR'

// action - dialog reducer
export const SHOW_CONFIRM = 'SHOW_CONFIRM'
export const HIDE_CONFIRM = 'HIDE_CONFIRM'

export const enqueueSnackbar = (notification: { message: string; options: OptionsObject }) => {
    const key = notification?.options?.key || new Date().getTime() + Math.random()

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key
        }
    } as const
}

export const closeSnackbar = (key: SnackbarKey) =>
    ({
        type: CLOSE_SNACKBAR,
        dismissAll: !key, // dismiss all if no key has been defined
        key
    } as const)

export const removeSnackbar = (key: SnackbarKey) =>
    ({
        type: REMOVE_SNACKBAR,
        key
    } as const)
