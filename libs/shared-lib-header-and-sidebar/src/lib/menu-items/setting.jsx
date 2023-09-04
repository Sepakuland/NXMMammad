// assets
import { IconSettings, IconFileSettings } from '@tabler/icons';
// icons
const icons = {
    IconSettings,
    IconFileSettings

};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const seasonalReports = {
    id: 'setting',
    title: 'settings',
    type: 'MegaGroup',
    icon: icons.IconSettings,
    children: [
        {
            id: 'AccountingSettings',
            title: 'Accounting Settings',
            type: 'item',
            url: '/Settings/AccountingSettings',
            icon: icons.IconFileSettings,
            breadcrumbs: true
        },
    ]
};

export default seasonalReports;