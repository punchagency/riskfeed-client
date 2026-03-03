import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));
const Home = lazy(() => import('@/pages/user/home'));
const Logout = lazy(() => import('@/pages/general/logout'));

const Project = lazy(() => import('@/pages/user/project/project'));
const CreateProject = lazy(() => import('@/pages/user/project/create-project'));

export const userRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/projects',
        element: <Project />,
      },
      {
        path: '/projects/create',
        element: <CreateProject />,
      },
    ],
  },
  {
    element: <Logout />,
    path: '/logout'
  }
];