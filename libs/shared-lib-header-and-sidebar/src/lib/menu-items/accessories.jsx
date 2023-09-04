// assets

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import {
    IconMessages, IconMessageDots, IconAugmentedReality2, IconUserSearch, IconFileSearch, IconChecklist, IconDatabase, IconServerCog, IconServerBolt, IconServer,
    IconBrandAndroid, IconBrandChrome, IconWriting
} from '@tabler/icons';

// icons
const icons = {
    IconUserSearch, IconChecklist, IconBrandAndroid, IconBrandChrome, IconWriting,
    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon,
    IconAugmentedReality2,
    IconFileSearch,
    IconServerCog,
    IconDatabase,
    IconMessages,
    IconMessageDots,
    IconServerBolt, IconServer,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const accessories = {
    id: 'accessories',
    title: 'Accessories',
    type: 'MegaGroup',
    icon: icons.IconAugmentedReality2,
    children: [
        {
            id: 'searchingForAccounts',
            title: 'Searching For Accounts',
            type: 'item',
            url: '/',
            icon: icons.IconUserSearch,
            breadcrumbs: true
        },
        {
            id: 'searchingCheques',
            title: 'Searching Cheques',
            type: 'item',
            url: '/',
            icon: icons.IconFileSearch,
            breadcrumbs: true
        },
        {
            id: 'cashingTheCheck',
            title: 'Cashing The Check',
            type: 'item',
            url: '/',
            icon: icons.IconChecklist,
            breadcrumbs: true
        },
        {
            id: 'databaseBackup',
            title: 'Database Backup',
            type: 'group',
            url: '/',
            icon: icons.IconDatabase,
            breadcrumbs: true,
            children: [
                {
                    id: 'manualBackup',
                    title: 'Manual Backup',
                    type: 'item',
                    url: '/',
                    icon: icons.IconServer,
                    breadcrumbs: true,
                },
                {
                    id: 'automaticBackup',
                    title: 'Automatic Backup',
                    type: 'item',
                    url: '/',
                    icon: icons.IconServerBolt,
                    breadcrumbs: true,
                },
                {
                    id: 'automaticBackupSetting',
                    title: 'Automatic Backup Setting',
                    type: 'item',
                    url: '/',
                    icon: icons.IconServerCog,
                    breadcrumbs: true,
                },
                {
                    id: 'mobileBackup',
                    title: 'Mobile Backup',
                    type: 'item',
                    url: '/',
                    icon: icons.IconBrandAndroid,
                    breadcrumbs: true,
                },

            ]
        },

        {
            id: 'chrome',
            title: 'Chrome',
            type: 'item',
            url: '/',
            icon: icons.IconBrandChrome,
            breadcrumbs: true
        },
        {
            id: 'androidApp',
            title: 'Android App',
            type: 'item',
            url: '/',
            icon: icons.IconBrandAndroid,
            breadcrumbs: true
        },
        {
            id: 'chat',
            title: 'Chat',
            type: 'item',
            url: '/',
            icon: icons.IconMessageDots,
            breadcrumbs: true
        },
        {
            id: 'notes',
            title: 'Notes',
            type: 'item',
            url: '/',
            icon: icons.IconWriting,
            breadcrumbs: true
        },
    ]
};

export default accessories;