// assets

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { IconLayoutDashboard,IconMathSymbols ,IconDashboard  } from '@tabler/icons';
// icons
const icons = {
    IconLayoutDashboard,IconMathSymbols ,
    IconDashboard ,
    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const dashboard = {
    id: 'dashboard1',
    title: 'Dashboard',
    type: 'MegaGroup',
    breadcrumbs: false,
    icon: icons.IconLayoutDashboard ,
    children: [
        {
            id: 'ManagementDashboard',
            title: 'Management Dashboard',
            type: 'item',
            url: '/',
            icon: icons.IconDashboard ,
            breadcrumbs: false
        },
        {
            id: 'commonDashboard',
            title: 'Computational Dashboard',
            type: 'item',
            url: '/',
            icon: icons.IconMathSymbols ,
            breadcrumbs: false
        },
    ]
};

export default dashboard;