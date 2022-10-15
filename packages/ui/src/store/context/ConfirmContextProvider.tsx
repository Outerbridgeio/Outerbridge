import { useReducer, createContext, Dispatch, PropsWithChildren } from 'react'
import { dialog } from '../reducers'

export const ConfirmContext = createContext([
    dialog.initialState,
    (() => {}) as Dispatch<Parameters<typeof dialog.dialogReducer>[1]>
] as const)

export const ConfirmContextProvider = (props: PropsWithChildren) => {
    const [state, dispatch] = useReducer(dialog.dialogReducer, dialog.initialState)

    return <ConfirmContext.Provider value={[state, dispatch]} {...props} />
}
