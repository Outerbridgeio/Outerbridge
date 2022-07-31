// assets
import { IconTrash, IconFileUpload, IconFileExport } from '@tabler/icons';

// constant
const icons = { IconTrash, IconFileUpload, IconFileExport };

// ==============================|| SETTINGS MENU ITEMS ||============================== //

const settings = {
    id: 'settings',
    title: '',
    type: 'group',
    children: [
        {
            id: 'loadWorkflow',
            title: 'Load Workflow',
            type: 'item',
            url: '',
            icon: icons.IconFileUpload,
        },
        {
            id: 'exportWorkflow',
            title: 'Export Workflow',
            type: 'item',
            url: '',
            icon: icons.IconFileExport,
        },
        {
            id: 'deleteWorkflow',
            title: 'Delete Workflow',
            type: 'item',
            url: '',
            icon: icons.IconTrash,
        }
    ],
};

export default settings;
