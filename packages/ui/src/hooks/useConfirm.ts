import { useContext } from 'react'
import { context, actions, reducer } from 'store'

let resolveCallback: (...args: unknown[]) => unknown

export const useConfirm = () => {
    const [confirmState, dispatch] = useContext(context.ConfirmContext)

    const closeConfirm = () => {
        dispatch({
            type: actions.HIDE_CONFIRM
        })
    }

    const onConfirm = () => {
        closeConfirm()
        resolveCallback(true)
    }

    const onCancel = () => {
        closeConfirm()
        resolveCallback(false)
    }
    const confirm = (confirmPayload: typeof reducer.dialog.initialState) => {
        dispatch({
            type: actions.SHOW_CONFIRM,
            payload: confirmPayload
        })
        return new Promise((res) => {
            resolveCallback = res
        })
    }

    return { confirm, onConfirm, onCancel, confirmState }
}
