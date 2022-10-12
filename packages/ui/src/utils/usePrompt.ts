import { History, Transition } from 'history'
import { useCallback, useContext, useEffect } from 'react'
import { Navigator } from 'react-router'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

// https://stackoverflow.com/questions/71572678/react-router-v-6-useprompt-typescript

type ExtendNavigator = Navigator & Pick<History, 'block'>
export function useBlocker(blocker: (tx: Transition) => void, when = true) {
    const { navigator } = useContext(NavigationContext)

    useEffect(() => {
        if (!when) return

        const unblock = (navigator as ExtendNavigator).block((tx) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock()
                    tx.retry()
                }
            }

            blocker(autoUnblockingTx)
        })

        return unblock
    }, [navigator, blocker, when])
}

export default function usePrompt(message: string, when = true) {
    const blocker = useCallback(
        (tx: Transition) => {
            if (window.confirm(message)) tx.retry()
        },
        [message]
    )

    useBlocker(blocker, when)
}
