import { lazy } from 'react';

// project import
import Loadable from '../components/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// render - login
// const AuthLogin = Loadable(lazy(() => import('../pages/authentication/Login')));
//render - PasswordSettings
// const AuthSetting = Loadable(lazy(() => import('../pages/authentication/AuthSetting')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        // {
        //     path: 'login',
        //     element: <AuthLogin />
        // },
        // {
        //     path: 'PasswordSettings',
        //     element: <AuthSetting />
        // },
    ]
};

export default LoginRoutes;
