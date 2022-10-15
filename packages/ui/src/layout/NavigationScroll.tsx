import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //

export const NavigationScroll = ({ children }: { children: ReactNode }) => {
    const location = useLocation()
    const { pathname } = location

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }, [pathname])

    return <>{children || null}</>
}
