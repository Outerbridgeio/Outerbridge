// assets
import { IconHierarchy, IconEditCircle, IconWallet } from '@tabler/icons';

// constant
const icons = { IconHierarchy, IconEditCircle, IconWallet };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'workflows',
            title: 'Workflows',
            type: 'item',
            url: '/workflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'contracts',
            title: 'Contracts',
            type: 'item',
            url: '/contracts',
            icon: icons.IconEditCircle,
            breadcrumbs: true
        },
        {
            id: 'wallets',
            title: 'Wallets',
            type: 'item',
            url: '/wallets',
            icon: icons.IconWallet,
            breadcrumbs: true
        }
    ],
};

export default dashboard;
