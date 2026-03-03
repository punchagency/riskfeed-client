import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';


const Signup = lazy(() => import('@/pages/public/signup'));
const Signin = lazy(() => import('@/pages/public/signin'));
const ContractorRegister = lazy(() => import('@/pages/public/signup/contractor-signup'));
const HomeownerRegister = lazy(() => import('@/pages/public/signup/homeowner-signup'));
const Logout = lazy(() => import('@/pages/general/logout'));

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
  }
];
