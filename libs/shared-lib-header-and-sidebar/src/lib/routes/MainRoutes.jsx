import { lazy } from 'react';
// project import
import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';

const DashboardDefault = Loadable(lazy(() => import('../Pages/dashboard')));

const NewDocument = Loadable(
  lazy(() =>
    import(
      '../../../../../apps/accounting/src/app/pages/New Document/NewDocument'
    )
  )
);
const Coding = Loadable(
  lazy(() =>
    import('../../../../../apps/accounting/src/app/pages/Coding/Coding')
  )
);
const Grid = Loadable(
  lazy(() =>
    import('../../../../../apps/accounting/src/app/pages/Coding/Grid')
  )
);
const DocumentGrid = Loadable(
  lazy(() =>
    import('../../../../../apps/accounting/src/app/pages/Document/Document')
  )
);

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: '/Accounting',
      children: [
        {
          path: 'NewDocument',
          element: <NewDocument />,
        },
        {
          path: 'coding',
          element: <Coding />,
        },
        {
          path: "Grid",
          element: <Grid />,
        },
        {
          path: "Document",
          element: <DocumentGrid />,
        },
        // {
        //   path: "Document/Trash",
        //   element: <DocumentTrashGrid />,
        // },
        // {
        //   path: "Document/Control",
        //   element: <DocumentControlGrid />,
        // },
        // {
        //   path: "Document/Archive",
        //   element: <DocumentArchiveGrid />,
        // },
        // {
        //   path: "ConfirmationDocuments",
        //   element: <DocumentArchiveGrid />,
        // },
      ],
    },
  ],
};

export default MainRoutes;
