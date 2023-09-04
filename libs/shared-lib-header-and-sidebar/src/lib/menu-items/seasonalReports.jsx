// assets
import { IconCalendarStats, IconSettings, IconFileExport } from '@tabler/icons';
// icons
const icons = {
    IconCalendarStats,
    IconSettings,
    IconFileExport
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const seasonalReports = {
    id: 'seasonalReports',
    title: 'Seasonal Reports',
    type: 'MegaGroup',
    icon: icons.IconCalendarStats,
    children: [
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/',
            icon: icons.IconSettings,
            breadcrumbs: true
        },
        {
            id: 'exportToAccess',
            title: 'Export To Access',
            type: 'item',
            url: '/',
            icon: icons.IconFileExport,
            breadcrumbs: true
        },
    ]
};

export default seasonalReports;