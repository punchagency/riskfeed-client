import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));
const Home = lazy(() => import('../pages/contractor/home'));
const Opportunities = lazy(()=> import('../pages/contractor/opportunities/opportunities'))

export const contractorRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'opportunities',
        element: <Opportunities />
      }
    ],
  },
];
