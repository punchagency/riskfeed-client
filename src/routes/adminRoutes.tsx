import type { RouteObject } from 'react-router-dom';
import DashboardLayout from '@/layout/dashboard-layout';



export const adminRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      
    ],
  },
];