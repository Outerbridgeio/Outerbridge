import { useEffect } from 'react'
import { useDispatch, useSelector, actions } from 'store'
import { useSnackbar, SnackbarKey } from 'notistack'

let displayed: SnackbarKey[] = []

export const useNotifier = () => {
    const dispatch = useDispatch()
    const notifier = useSelector((state) => state.notifier)
    const { notifications } = notifier

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const storeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed, id]
    }

    const removeDisplayed = (id: SnackbarKey) => {
        displayed = [...displayed.filter((key) => id !== key)]
    }

    useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key)
                return
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: options.onClose,
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(actions.removeSnackbar(myKey))
                    removeDisplayed(myKey)
                }
            })

            // keep track of snackbars that we've displayed
            storeDisplayed(key)
        })
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])
}
