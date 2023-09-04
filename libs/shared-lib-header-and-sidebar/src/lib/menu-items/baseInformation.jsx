// assets
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import {
    IconFileInfo, IconBuildingSkyscraper, IconCalendarStats, IconTools, IconRulerMeasure, IconFileSettings, IconHome, IconFileDollar, IconReceipt,
    IconTags, IconFileCheck, IconDirections, IconDiscount, IconTargetArrow, IconCheckupList, IconReportAnalytics, IconHomeDollar, IconCashBanknote,
    IconBuildingBank, IconCalendar, IconCash, IconCoin, IconChecklist, IconSettings, IconDeviceMobile, IconVocabulary, IconMap2, IconMap, IconMapSearch,
    IconPrinter, IconCalculator, IconSpeakerphone, IconSourceCode, IconUsers, IconCar, IconBasket, IconFileDescription, IconBuildingWarehouse
    , IconBuildingCottage, IconBarcode, IconFileBarcode, IconBox
} from '@tabler/icons';
// icons
const icons = {
    IconUsers,
    IconCar,
    IconBasket,
    IconCalculator,
    GroupsOutlinedIcon,
    EmojiEventsOutlinedIcon,
    IconFileInfo,
    IconBuildingSkyscraper,
    IconCalendarStats,
    IconTools,
    IconFileSettings,
    IconHome,
    IconRulerMeasure,
    IconFileDollar,
    IconReceipt,
    IconTags,
    IconFileCheck,
    IconDirections,
    IconDiscount,
    IconTargetArrow,
    IconCheckupList,
    IconReportAnalytics,
    IconHomeDollar,
    IconCashBanknote,
    IconBuildingBank,
    IconCash,
    IconCalendar,
    IconCoin,
    IconChecklist,
    IconSettings,
    IconDeviceMobile,
    IconVocabulary,
    IconMap2,
    IconMap,
    IconMapSearch,
    IconPrinter,
    IconSpeakerphone,
    IconFileDescription,
    IconBuildingCottage,
    IconBuildingWarehouse,
    IconBarcode,
    IconSourceCode,
    IconFileBarcode,
    IconBox
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const baseInformation = {
    id: 'baseInformation',
    title: 'Base Information',
    type: 'MegaGroup',
    icon: icons.IconFileInfo,
    children: [
        {
            id: 'notification',
            title: 'Notification',
            type: 'item',
            url: '/baseInformation/Notification',
            icon: icons.IconSpeakerphone,
            breadcrumbs: true
        },
        {
            id: 'accounting',
            title: 'Accounting',
            type: 'group',
            url: '/',
            icon: icons.IconCalculator,
            breadcrumbs: true,
            children: [

                {
                    id: 'year',
                    title: 'Year',
                    type: 'item',
                    url: '/baseInformation/accounting/FiscalYear',
                    icon: icons.IconCalendarStats,
                    breadcrumbs: true,

                },
                {
                    id: 'documentDefinition',
                    title: 'DocumentDefinition',
                    type: 'item',
                    url: '/baseInformation/accounting/DocumentDefinition',
                    icon: icons.IconFileDescription,
                    breadcrumbs: true,

                },
                {
                    id: 'entity',
                    title: 'Entity',
                    type: 'item',
                    url: '/baseInformation/accounting/entity',
                    icon: icons.IconTools,
                    breadcrumbs: true,

                },

            ]
        },
        {
            id: 'wareHouse_baseInfo',
            title: 'WareHouse',
            type: 'group',
            url: '/',
            icon: icons.IconHome,
            breadcrumbs: true,
            children: [
                {
                    id: "MaintenanceCenters",
                    title: 'Maintenance Centers',
                    type: 'item',
                    url: 'baseInformation/WareHouse/MaintenanceCenters',
                    icon: icons.IconBuildingWarehouse,
                    breadcrumbs: true
                },
                {
                    id: "WareHouse",
                    title: 'WareHouse',
                    type: 'item',
                    // url: '/',
                    icon: icons.IconBuildingCottage,
                    breadcrumbs: true
                },
                {
                    id: "MeasurementUnit",
                    title: 'Measurement Unit',
                    type: 'item',
                    // url: '/',
                    icon: icons.IconRulerMeasure,
                    breadcrumbs: true
                },
                {
                    id: 'ProductFeature',
                    title: 'Product Feature',
                    type: 'item',
                    url: '/baseInformation/wareHouse/ProductFeature',
                    icon: icons.IconTags,
                    breadcrumbs: true,
                },
                {
                    id: 'CodingPattern',
                    title: 'Coding pattern',
                    type: 'item',
                    // url: '/baseInformation/wareHouse/',
                    icon: icons.IconSourceCode,
                    breadcrumbs: true,
                },
                {
                    id: 'BarcodePattern',
                    title: 'Barcode Pattern',
                    type: 'item',
                    // url: '/baseInformation/wareHouse/',
                    icon: icons.IconBarcode,
                    breadcrumbs: true,
                },
                {
                    id: 'SeriesPatternFabrication',
                    title: 'Series Pattern Fabrication',
                    type: 'item',
                    // url: '/baseInformation/wareHouse/',
                    icon: icons.IconFileBarcode,
                    breadcrumbs: true,
                },
                {
                    id: 'Products',
                    title: 'Products',
                    type: 'item',
                    url: '/baseInformation/wareHouse/',
                    icon: icons.IconBox,
                    breadcrumbs: true,
                },
                // {
                //     id: 'documentType',
                //     title: 'Document Type',
                //     type: 'item',
                //     url: '/baseInformation/wareHouse/DocumentType',
                //     icon: icons.IconReceipt,
                //     breadcrumbs: true,
                // }
            ]
        },
        {
            id: 'sale',
            title: 'Sale',
            type: 'group',
            url: '/',
            icon: icons.IconTags,
            breadcrumbs: true,
            children: [
                {
                    id: 'settlementType',
                    title: 'Settlement Type',
                    type: 'item',
                    url: '/baseInformation/sale/SettlementType',
                    icon: icons.IconFileCheck,
                    breadcrumbs: true,
                },
                {
                    id: 'reversionReson',
                    title: 'Reversion Reson',
                    type: 'item',
                    url: '/baseInformation/sale/ReversionReason',
                    icon: icons.IconTags,
                    breadcrumbs: true,
                },
                {
                    id: 'notOrderReson',
                    title: 'Not Order Reson',
                    type: 'item',
                    url: '/baseInformation/sale/NotOrderReason',
                    icon: icons.IconTags,
                    breadcrumbs: true,
                },
                {
                    id: 'distributionPath',
                    title: 'Distribution Path',
                    type: 'item',
                    url: '/baseInformation/sale/DistributionPath',
                    icon: icons.IconDirections,
                    breadcrumbs: true,
                },
                {
                    id: 'discountRule',
                    title: 'Discount Rule',
                    type: 'item',
                    url: '/baseInformation/sale/DiscountRule',
                    icon: icons.IconDiscount,
                    breadcrumbs: true,
                },
                {
                    id: 'salesGoals',
                    title: 'Goal Sale',
                    type: 'item',
                    url: '/baseInformation/sale/Goals',
                    icon: icons.IconTargetArrow,
                    breadcrumbs: true,
                },
                {
                    id: 'visitProgram',
                    title: 'Visit Program',
                    type: 'item',
                    url: '/',
                    icon: icons.IconCheckupList,
                    breadcrumbs: true,
                },
                {
                    id: 'stuffSaleBudgeting',
                    title: 'Stuff Sale Budgeting',
                    type: 'item',
                    url: '/baseInformation/sale/stuffSaleBudgeting',
                    icon: icons.IconReportAnalytics,
                    breadcrumbs: true,
                },
            ]
        },
        {
            id: 'financialTransaction',
            title: 'FinancialTransaction',
            type: 'group',
            url: '/',
            icon: icons.IconHomeDollar,
            breadcrumbs: true,
            children: [
                {
                    id: 'chequeDefinition',
                    title: 'Cheque Definition',
                    type: 'item',
                    url: '/',
                    icon: icons.IconCashBanknote,
                    breadcrumbs: true,
                },
                {
                    id: 'bankDefinition',
                    title: 'Bank Definition',
                    type: 'item',
                    url: '/',
                    icon: icons.IconBuildingBank,
                    breadcrumbs: true,

                }
            ]
        },
        {
            id: 'payroll',
            title: 'Payroll',
            type: 'group',
            url: '/',
            icon: icons.IconCash,
            breadcrumbs: true,
            children: [
                {
                    id: 'calendarOfWorkingDays',
                    title: 'Calendar of Working Days',
                    type: 'item',
                    url: '/baseInformation/payroll/WorkingDaysCalendar',
                    icon: icons.IconCalendar,
                    breadcrumbs: true,
                },
                {
                    id: 'salaryFactors',
                    title: 'Salary Factors',
                    type: 'item',
                    url: '/baseInformation/payroll/SalaryFactors',
                    icon: icons.IconCoin,
                    breadcrumbs: true,
                },
                {
                    id: 'salaryRule',
                    title: 'Salary Rule',
                    type: 'item',
                    url: '/baseInformation/payroll/SalaryRule',
                    icon: icons.IconChecklist,
                    breadcrumbs: true,
                },
                {
                    id: 'insuranceSettings',
                    title: 'Insurance Settings',
                    type: 'item',
                    url: '/baseInformation/payroll/InsuranceSettings',
                    icon: icons.IconSettings,
                    breadcrumbs: true,
                },
                {
                    id: 'taxSettings',
                    title: 'Tax Settings',
                    type: 'item',
                    url: '/baseInformation/payroll/TaxSettings',
                    icon: icons.IconSettings,
                    breadcrumbs: true,
                },
            ]
        },
        {
            id: 'mobile',
            title: 'Mobile',
            type: 'group',
            url: '/',
            icon: icons.IconDeviceMobile,
            breadcrumbs: true,
            children: [
                {
                    id: 'stuffsCatalogsOrder',
                    title: 'Stuffs Catalogs Order',
                    type: 'item',
                    url: '/',
                    icon: icons.IconVocabulary,
                    breadcrumbs: true,
                },
            ]
        },
        {
            id: 'map',
            title: 'Map',
            type: 'group',
            url: '/',
            icon: icons.IconMap,
            breadcrumbs: true,
            children: [
                {
                    id: 'zoneDefinition',
                    title: 'Zone Definition',
                    type: 'item',
                    url: '/baseInformation/map/AreasPlacement',
                    icon: icons.IconMap2,
                    breadcrumbs: true,
                },
                {
                    id: 'vehicleTrackerDevice',
                    title: 'Vehicle Tracker Device',
                    type: 'item',
                    url: '/baseInformation/map/VehicleTrackingDevices',
                    icon: icons.IconMapSearch,
                    breadcrumbs: true,
                },
            ]
        },
        {
            id: 'common',
            title: 'Common',
            type: 'group',
            url: '/',
            icon: icons.IconUsers,
            breadcrumbs: true,
            children: [
                {
                    id: 'compony',
                    title: 'Compony',
                    type: 'item',
                    url: '/baseInformation/accounting/Company',
                    icon: icons.IconBuildingSkyscraper,
                    breadcrumbs: true,

                },
                {
                    id: 'printSetting',
                    title: 'Print Setting',
                    type: 'item',
                    url: '/',
                    icon: icons.IconPrinter,
                    breadcrumbs: true,

                },
            ]
        },
    ]
};

export default baseInformation;