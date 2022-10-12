import { useContext } from 'react'
import ConfirmContext from 'store/context/ConfirmContext'
import { actions } from 'store'

let resolveCallback: (...args: unknown[]) => unknown

export const useConfirm = () => {
    const [confirmState, dispatch] = useContext(ConfirmContext)

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
    const confirm = (confirmPayload: unknown) => {
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
