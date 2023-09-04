import { lazy } from 'react';
// project import
import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('../Pages/dashboard')));

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
      path: '/Dashboard',
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />,
        },
        {
          path: 'common',
          children: [
            {
              path: 'dashboard',
              element: <DashboardDefault />,
            },
          ],
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
