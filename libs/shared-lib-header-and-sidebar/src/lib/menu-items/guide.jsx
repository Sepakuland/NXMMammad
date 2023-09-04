// assets
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import {
    IconHelp, IconNotebook,IconBrandYoutube ,IconAlertCircle ,IconDevices ,
} from '@tabler/icons';
// icons
const icons = {

    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon,
    IconHelp,
    IconNotebook,
    IconBrandYoutube ,
    IconAlertCircle ,
    IconDevices ,


};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const guide = {
    id: 'guide',
    title: 'Guide',
    type: 'MegaGroup',
    icon: icons.IconNotebook,
    children: [
        {
            id: 'help',
            title: 'Help',
            type: 'item',
            url: '/',
            icon: icons.IconHelp,
            breadcrumbs: true
        },
        {
            id: 'learningVideo',
            title: 'Learning Video',
            type: 'item',
            url: '/',
            icon: icons.IconBrandYoutube ,
            breadcrumbs: true
        },
        {
            id: 'aboutKara',
            title: 'About Kara',
            type: 'item',
            url: '/',
            icon: icons.IconAlertCircle ,
            breadcrumbs: true
        },
        {
            id: 'anyDesk',
            title: 'AnyDesk',
            type: 'item',
            url: '/',
            icon: icons.IconDevices ,
            breadcrumbs: true
        },
    ]
};

export default guide;