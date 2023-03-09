import { lazy } from 'react'

// project imports
import MainLayout from 'layout/MainLayout'
import Loadable from 'ui-component/Loadable'

// workflows routing
const Workflows = Loadable(lazy(() => import('views/workflows')))

// contracts routing
const Contracts = Loadable(lazy(() => import('views/contracts')))

// wallets routing
const Wallets = Loadable(lazy(() => import('views/wallets')))

// apikey routing
const APIKey = Loadable(lazy(() => import('views/apikey')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Workflows />
        },
        {
            path: '/workflows',
            element: <Workflows />
        },
        {
            path: '/contracts',
            element: <Contracts />
        },
        {
            path: '/wallets',
            element: <Wallets />
        },
        {
            path: '/apikey',
            element: <APIKey />
        }
    ]
}

export default MainRoutes
