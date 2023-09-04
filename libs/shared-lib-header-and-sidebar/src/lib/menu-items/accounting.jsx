// assets
import {
    IconBuildingWarehouse, IconLayersSubtract, IconReportMoney, IconEdit, IconFiles, IconCash, IconCalculator, IconSourceCode, IconFileCertificate, IconFileInvoice,
    IconHome, IconArrowBarToLeft, IconArrowBarLeft, IconChecklist, IconFileCheck, IconNumbers, IconArchive, IconFilesOff, IconFolder
} from '@tabler/icons';
// icons
const icons = {
    IconArrowBarToLeft,
    IconArrowBarLeft,
    IconBuildingWarehouse,
    IconReportMoney,
    IconEdit, IconFileInvoice,
    IconFiles,
    IconLayersSubtract,
    IconCash,
    IconCalculator,
    IconSourceCode,
    IconFileCertificate,
    IconHome,
    IconChecklist,
    IconFileCheck,
    IconNumbers,
    IconArchive,
    IconFilesOff,
    IconFolder
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const accounting = {
    id: 'Accounting',
    title: 'Accounting',
    type: 'MegaGroup',
    icon: icons.IconCalculator,
    children: [
        {
            id: 'accountsCoding',
            title: 'Accounts coding',
            type: 'item',
            url: '/Accounting/coding',
            icon: icons.IconSourceCode,
            breadcrumbs: true
        },
        {
            id: 'NewDocument',
            title: 'New Document',
            type: 'item',
            url: '/Accounting/NewDocument',
            icon: icons.IconFileCertificate,
            breadcrumbs: true
        },
        {
            id: 'documents',
            title: 'Documents',
            type: 'item',
            url: '/Accounting/Document',
            icon: icons.IconFiles,
            breadcrumbs: true
        },
        {
            id: 'DocumentsConfirmation',
            title: 'Documents Confirmation',
            type: 'item',
            url: '/Accounting/ConfirmationDocuments',
            icon: icons.IconFileCheck,
            breadcrumbs: true
        },
        {
            id: 'Renumber',
            title: 'Renumber',
            type: 'item',
            url: '/Accounting/Renumber',
            icon: icons.IconNumbers,
            breadcrumbs: true
        },
        {
            id: 'DocumentsPermanent',
            title: 'Make documents permanent',
            type: 'item',
            url: '/Accounting/DocumentsPermanent',
            icon: icons.IconArchive,
            breadcrumbs: true
        },
        {
            id: 'accountsReview',
            title: 'Accounts Review',
            type: 'item',
            url: '/Accounting/AccountReview',
            icon: icons.IconFileInvoice,
            breadcrumbs: true
        },
        {
            id: 'GeneralDocuments',
            title: 'General documents',
            type: 'item',
            url: '/Accounting/GeneralDocuments',
            icon: icons.IconFolder,
            breadcrumbs: true
        },
        {
            id: 'ClosingProfitLossAccounts',
            title: 'Closing profit and loss accounts',
            type: 'item',
            url: '/Accounting/ClosingProfitLossAccounts',
            icon: icons.IconFilesOff,
            breadcrumbs: true
        },
    ]
};

export default accounting;
