// assets
import { DashboardOutlined, TeamOutlined , CalculatorOutlined } from '@ant-design/icons';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
// icons
const icons = {
    DashboardOutlined,
    TeamOutlined,
    CalculatorOutlined,
    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const buy = {
    id: 'buy',
    title: 'Buy',
    type: 'MegaGroup',
    icon: icons.CalculatorOutlined,
    children: [
        {
            id: 'needs',
            title: 'Needs',
            type: 'item',
            url: '/',
            icon: icons.DashboardOutlined,
            breadcrumbs: true
        },
        {
            id: 'order',
            title: 'Order',
            type: 'item',
            url: '/',
            icon: icons.TeamOutlined,
            breadcrumbs: true
        },
        {
            id: 'orderConfirmation',
            title: 'Order Confirmation',
            type: 'item',
            url: '/',
            icon: icons.GroupsOutlinedIcon,
            breadcrumbs: true
        },
        {
            id: 'reversion',
            title: 'Reversion',
            type: 'item',
            url: '/',
            icon: icons.EmojiEventsOutlinedIcon,
            breadcrumbs: true
        },
    ]
};

export default buy;