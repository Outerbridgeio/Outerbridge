// assets
import { IconTrash, IconFileUpload, IconFileExport } from '@tabler/icons'

// constant
const icons = { IconTrash, IconFileUpload, IconFileExport }

// ==============================|| SETTINGS MENU ITEMS ||============================== //

export const settings = {
    id: 'settings' as const,
    title: '',
    type: 'group' as const,
    children: [
        {
            id: 'loadWorkflow' as const,
            title: 'Load Workflow',
            type: 'item' as const,
            url: '',
            icon: icons.IconFileUpload
        },
        {
            id: 'exportWorkflow' as const,
            title: 'Export Workflow',
            type: 'item' as const,
            url: '',
            icon: icons.IconFileExport
        },
        {
            id: 'deleteWorkflow' as const,
            title: 'Delete Workflow',
            type: 'item' as const,
            url: '',
            icon: icons.IconTrash
        }
    ]
}

export type Settings = typeof settings
