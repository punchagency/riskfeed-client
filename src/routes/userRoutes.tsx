import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));
const Home = lazy(() => import('@/pages/user/home'));
const Logout = lazy(() => import('@/pages/general/logout'));

const Project = lazy(() => import('@/pages/user/project/project'));
const CreateProject = lazy(() => import('@/pages/user/project/create-project'));
const ProjectDetail = lazy(() => import('@/pages/user/project/project-details'));
const Properties = lazy(() => import('@/pages/user/properties/properties'));
const CreateProperty = lazy(() => import('@/pages/user/properties/create-property'));
const UpdateProperty = lazy(() => import('@/pages/user/properties/update-property'));
const Contractor = lazy(() => import('@/pages/user/contractor/contractor'));
const Invite = lazy(() => import('@/pages/user/invite/invite'));

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
      {
        path: '/projects/:id',
        element: <ProjectDetail />,
      },
      {
        path: '/properties',
        element: <Properties />,
      },
      {
        path: '/properties/create',
        element: <CreateProperty />,
      },
      {
        path: '/properties/update/:id',
        element: <UpdateProperty />,
      },
      {
        path: '/contractors',
        element: <Contractor />,
      },
      {
        path: '/contractors/invite/:contractorId',
        element: <Invite />,
      },
    ],
  },
  {
    element: <Logout />,
    path: '/logout'
  }
];