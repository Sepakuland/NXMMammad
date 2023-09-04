// assets
import { IconLogin, IconUser, IconKey } from '@tabler/icons';
// icons
const icons = {
    IconLogin,
    IconUser,
    IconKey
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'Authentication',
    title: 'Authentication',
    type: 'MegaGroup',
    icon: icons.IconUser,
    children: [
        {
            id: 'Login',
            title: 'Login',
            type: 'item',
            url: '/login',
            icon: icons.IconLogin,
            breadcrumbs: true
        },
        {
            id: 'PasswordSettings',
            title: 'تنظیمات رمز عبور',
            type: 'item',
            url: '/PasswordSettings',
            icon: icons.IconKey,
            breadcrumbs: true
        },
    ]
};

export default pages;
