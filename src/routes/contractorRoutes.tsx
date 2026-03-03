import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));

export const contractorRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      
    ],
  },
];
