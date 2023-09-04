// assets
import { IconCash, IconFileTime, IconReceipt2, IconBusinessplan } from '@tabler/icons';
// icons
const icons = {
    IconFileTime,
    IconCash,
    IconReceipt2,
    IconBusinessplan,
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const payroll = {
    id: 'payroll',
    title: 'Payroll',
    type: 'MegaGroup',
    icon: icons.IconCash,
    children: [
        {
            id: 'workingHours',
            title: 'Working Hours',
            type: 'item',
            url: '/Payroll/workingHours',
            icon: icons.IconFileTime,
            breadcrumbs: true
        },
        {
            id: 'loans',
            title: 'Loans',
            type: 'item',
            url: '/Payroll/loans',
            icon: icons.IconBusinessplan,
            breadcrumbs: true
        },
        {
            id: 'salaryBillIssuance',
            title: 'Salary Bill Issuance',
            type: 'item',
            url: '/Payroll/salaryBillIssuance',
            icon: icons.IconReceipt2,
            breadcrumbs: true
        },
    ]
};

export default payroll;