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
      ],
    },
  ],
};

export default MainRoutes;
