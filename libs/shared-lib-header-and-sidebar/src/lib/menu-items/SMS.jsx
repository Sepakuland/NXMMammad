// assets
import { IconMessageDots, IconMessagePlus, IconMessageForward, IconSettings, IconMessages } from '@tabler/icons';
// icons
const icons = {
    IconMessageDots,
    IconMessagePlus,
    IconMessageForward,
    IconSettings,
    IconMessages

};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const SMS = {
    id: 'SMS',
    title: 'SMS',
    type: 'MegaGroup',
    icon: icons.IconMessages,
    children: [
        {
            id: 'send',
            title: 'Send',
            type: 'item',
            url: '/',
            icon: icons.IconMessageForward,
            breadcrumbs: true
        },
        {
            id: 'receive',
            title: 'Receive',
            type: 'item',
            url: '/',
            icon: icons.IconMessagePlus,
            breadcrumbs: true
        },
        {
            id: 'autoSMSConfiguration',
            title: 'Auto SMS Configuration',
            type: 'item',
            url: '/',
            icon: icons.IconSettings,
            breadcrumbs: true
        },
        {
            id: 'sendingQueue',
            title: 'Sending Queue',
            type: 'item',
            url: '/',
            icon: icons.IconMessageDots,
            breadcrumbs: true
        },
    ]
};

export default SMS;