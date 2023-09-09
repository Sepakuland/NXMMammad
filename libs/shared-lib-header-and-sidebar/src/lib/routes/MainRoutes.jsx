import { lazy } from 'react';
// project import
import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('../Pages/dashboard')));

const NewDocument = Loadable(
  lazy(() => import('../Pages/Accounting/New Document/NewDocument'))
);
const EditNewDocument = Loadable(
  lazy(() => import('../Pages/Accounting/New Document/EditNewDocument'))
);
const DocumentGrid = Loadable(
  lazy(() => import('../Pages/Accounting/Document/Document'))
);
const DocumentTrashGrid = Loadable(
  lazy(() =>
    import('../Pages/Accounting/Document/Inner Grids/TrashGrid/DocumentTrash')
  )
);
const DocumentControlGrid = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/Document/Inner Grids/ControlGrid/DocumentControl'
    )
  )
);
const DocumentArchiveGrid = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/Document/Inner Grids/ArchiveGrid/DocumentArchive'
    )
  )
);
const AccountSetting = Loadable(
  lazy(() => import('../Pages/Accounting/AccountingSetting/AccountSetting'))
);

const IncomeChart = Loadable(
  lazy(() => import('../Pages/Accounting/IncomeConfirmation/Chart'))
);

const ExitWareHouseConfrimation = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/WareHouseConfirmation/ExitWareHouseConfrimation/ExitWareHouse'
    )
  )
);
const ChartTreasuryConfirmation = Loadable(
  lazy(() =>
    import('../Pages/Accounting/TreasuryConfirmation/TreasuryConfirmationChart')
  )
);
const OpenWareHouseConfirmationDisplayDetail = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/WareHouseConfirmation/OpenWareHouseConfirmation/OpenWareHouse'
    )
  )
);
const AutomaticDocumentAmendmentProp = Loadable(
  lazy(() =>
    import('../Pages/Accounting/AutomaticDocumentAmendment/AutomaticDocument')
  )
);
const SaleOrderConfrim = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/WareHouseConfirmation/SaleOrderConfrim/SaleOrderConfrim'
    )
  )
);
const AutomaticDocumentEdit = Loadable(
  lazy(() =>
    import('../Pages/Accounting/AutomaticDocumentEdit/AutomaticDocumentEdit')
  )
);
const FinancialConfirmation = Loadable(
  lazy(() => import('../Pages/Accounting/TreasuryConfirmation/DisplayDetails'))
);
//const OpenWareHouseChart = Loadable(
//  lazy(() =>
//    import(
//      "../Pages/Accounting/WareHouseConfirmation/OpenWareHouseConfirmation/OpenWareHouseChart"
//    )
//  )
//);
const IncomeConfirmationGrid = Loadable(
  lazy(() =>
    import('../Pages/Accounting/IncomeConfirmation/IncomeConfirmation')
  )
);

const SettingUlGridProp = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/AccountingSetting/SettingUltimateGrid/DisplayDetailsSettingUltimateGrid'
    )
  )
);
// const CashPaymentSharing = Loadable(
//     lazy(() =>
//         import(
//             "../Pages/FinancialTransaction/PaymentDocumention/Cash/Display"
//             )
//     )
// );

const AccountReview = Loadable(
  lazy(() => import('../Pages/Accounting/AccountReview/AccountReview'))
);

const GeneralDocuments = Loadable(
  lazy(() => import('../Pages/Accounting/GeneralDocuments'))
);

const GeneralDocumentsNew = Loadable(
  lazy(() => import('../Pages/Accounting/GeneralDocuments/NewGeneralDocument'))
);

const ClosingProfitLossAccounts = Loadable(
  lazy(() => import('../Pages/Accounting/ClosingProfitLossAccounts'))
);

const Renumber = Loadable(lazy(() => import('../Pages/Accounting/Renumber')));

const DocumentsPermanent = Loadable(
  lazy(() => import('../Pages/Accounting/DocumentsPermanent'))
);

const AggregatedDocument = Loadable(
  lazy(() =>
    import('../Pages/Accounting/AggregatedDocument/AggregatedDocument')
  )
);
const AmendmentGrid = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/AutomaticDocumentAmendment/show/DisplayDetailsAutomaticAmendement'
    )
  )
);

const NewAggregatedDocument = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/AggregatedDocument/newAggregatedDocument/NewAggregatedDocument'
    )
  )
);
const OpenWareHouseConfirmationShopping = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/WareHouseConfirmation/OpenWareHouseConfirmation/Shopping'
    )
  )
);

const ProgressGridProp = Loadable(
  lazy(() =>
    import(
      '../Pages/Accounting/AutomaticDocumentAmendment/ProgressFolder/DisplayDetailsProgressGrid'
    )
  )
);

const AggregatedDocumentChart = Loadable(
  lazy(() =>
    import('../Pages/Accounting/AggregatedDocument/AggregatedDocumentChart')
  )
);

const AccessManagement = Loadable(
  lazy(() => import('../Pages/AccessManagement/AccessManagement'))
);

const Coding = Loadable(
  lazy(() => import('../Pages/Accounting/Coding/Coding'))
);

const AccountingSettings = Loadable(
  lazy(() => import('../Pages/Setting/AccountingSettings/Accounting'))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: '/AccessManagement',
      element: <AccessManagement />,
    },
    {
      path: '/Accounting',
      children: [
        {
          path: 'ProgressGridProp',
          element: <ProgressGridProp />,
        },
        {
          path: 'coding',
          element: <Coding />,
        },
        {
          path: 'AutomaticDocumentAmendment/AmendmentGrid',
          element: <AmendmentGrid />,
        },
        {
          path: 'AutomaticDocumentEdit',
          element: <AutomaticDocumentEdit />,
        },
        {
          path: 'NewDocument',
          element: <NewDocument />,
        },
        {
          path: 'EditNewDocument',
          element: <EditNewDocument />,
        },
        {
          path: 'Document',
          element: <DocumentGrid />,
        },
        {
          path: 'Document/Trash',
          element: <DocumentTrashGrid />,
        },
        {
          path: 'Document/Control',
          element: <DocumentControlGrid />,
        },
        {
          path: 'Document/Archive',
          element: <DocumentArchiveGrid />,
        },
        {
          path: 'ConfirmationDocuments',
          element: <DocumentArchiveGrid />,
        },
        {
          path: 'Renumber',
          element: <Renumber />,
        },
        {
          path: 'DocumentsPermanent',
          element: <DocumentsPermanent />,
        },
        {
          path: 'AccountReview',
          element: <AccountReview />,
        },
        {
          path: 'GeneralDocuments',
          element: <GeneralDocuments />,
        },
        {
          path: 'GeneralDocuments/AddNew',
          element: <GeneralDocumentsNew />,
        },
        {
          path: 'ClosingProfitLossAccounts',
          element: <ClosingProfitLossAccounts />,
        },
        {
          path: 'incomeConfirmation',
          element: <IncomeConfirmationGrid />,
        },
        {
          path: 'incomeConfirmation/Chart',
          element: <IncomeChart />,
        },
        {
          path: 'wareHouseConfirmation',
          children: [
            {
              path: 'wareHouseEntrance',
              element: <OpenWareHouseConfirmationDisplayDetail />,
            },
            {
              path: 'wareHouseEntrance/Shopping',
              element: <OpenWareHouseConfirmationShopping />,
            },
            //{
            //  path: "wareHouseEntrance/Chart",
            //  element: <OpenWareHouseChart />,
            //},
            {
              path: 'leavingthewarehouse',
              element: <ExitWareHouseConfrimation />,
            },
            {
              path: 'SalesInvoice',
              element: <SaleOrderConfrim />,
            },
          ],
        },
        {
          path: 'financialConfirmation',
          element: <FinancialConfirmation />,
        },
        {
          path: 'financialConfirmation/Chart',
          element: <ChartTreasuryConfirmation />,
        },
        {
          path: 'payrollConfirmation',
          element: <DashboardDefault />,
        },
        {
          path: 'calculateWareHousePrices',
          element: <DashboardDefault />,
        },
        {
          path: 'aggregatedDocument',
          element: <AggregatedDocument />,
        },
        {
          path: 'AggregatedDocument/NewAggregatedDocument',
          element: <NewAggregatedDocument />,
        },
        {
          path: 'AggregatedDocument/Chart',
          element: <AggregatedDocumentChart />,
        },
        {
          path: 'match',
          element: <DashboardDefault />,
        },
        {
          path: 'AccountSettingGrid',
          element: <AccountSetting />,
        },
        {
          path: 'SettingUltimateGridR',
          element: <SettingUlGridProp />,
        },
        {
          path: 'AutomaticDocumentAmendment',
          element: <AutomaticDocumentAmendmentProp />,
        },
      ],
    },
    {
      path: '/Settings',
      children: [
        {
          path: 'AccountingSettings',
          element: <AccountingSettings />,
        },
      ],
    },
  ],
};

export default MainRoutes;
