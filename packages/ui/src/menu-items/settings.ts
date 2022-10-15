// assets
import { IconTrash, IconFileUpload, IconFileExport } from '@tabler/icons'

// constant
const icons = { IconTrash, IconFileUpload, IconFileExport }

// ==============================|| SETTINGS MENU ITEMS ||============================== //

export const settings = {
    id: 'settings' as const,
    title: '',
    type: 'group',
    children: [
        {
            id: 'loadWorkflow' as const,
            title: 'Load Workflow',
            type: 'item',
            url: '',
            icon: icons.IconFileUpload
        },
        {
            id: 'exportWorkflow' as const,
            title: 'Export Workflow',
            type: 'item',
            url: '',
            icon: icons.IconFileExport
        },
        {
            id: 'deleteWorkflow' as const,
            title: 'Delete Workflow',
            type: 'item',
            url: '',
            icon: icons.IconTrash
        }
    ]
} as const
