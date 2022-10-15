// assets
import { IconHierarchy, IconEditCircle, IconWallet } from '@tabler/icons'

// constant
const icons = { IconHierarchy, IconEditCircle, IconWallet }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const dashboard = {
    id: 'dashboard' as const,
    title: '',
    type: 'group',
    children: [
        {
            id: 'workflows' as const,
            title: 'Workflows',
            type: 'item',
            url: '/workflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'contracts' as const,
            title: 'Contracts',
            type: 'item',
            url: '/contracts',
            icon: icons.IconEditCircle,
            breadcrumbs: true
        },
        {
            id: 'wallets' as const,
            title: 'Wallets',
            type: 'item',
            url: '/wallets',
            icon: icons.IconWallet,
            breadcrumbs: true
        }
    ]
}

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    items: [dashboard]
}
