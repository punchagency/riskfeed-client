import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';


const Signup = lazy(() => import('@/pages/public/signup'));
const Signin = lazy(() => import('@/pages/public/signin'));
const ContractorRegister = lazy(() => import('@/pages/public/signup/contractor-signup'));
const HomeownerRegister = lazy(() => import('@/pages/public/signup/homeowner-signup'));
const Logout = lazy(() => import('@/pages/general/logout'));
const ActivateAccount = lazy(() => import('@/pages/public/activate-account'));
const ForgotPassword = lazy(() => import('@/pages/public/forgot-password'));

export const publicRoutes: RouteObject[] = [
  {
    element: <Signup />,
    path: '/signup',
  },
  {
    element: <Signin />,
    path: '/signin'
  },
  {
    element: <ContractorRegister />,
    path: '/signup/contractor'
  },
  {
    element: <HomeownerRegister />,
    path: '/signup/homeowner'
  },
  {
    element: <Logout />,
    path: '/logout'
  },
  {
    element: <ActivateAccount />,
    path: '/activate-account'
  },
  {
    element: <ForgotPassword />,
    path: '/forgot-password'
  }
];
