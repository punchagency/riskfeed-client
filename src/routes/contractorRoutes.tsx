import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));
const Home = lazy(() => import('../pages/contractor/home'));
const Opportunities = lazy(()=> import('../pages/contractor/opportunities/opportunities'))
const ExpressInterest = lazy(()=> import('../pages/contractor/opportunities/express-interest'))
const Jobs = lazy(()=> import('../pages/contractor/jobs/jobs'));
const Messages = lazy(() => import('@/pages/contractor/messages/messages'));

export const contractorRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/opportunities',
        element: <Opportunities />
      },
      {
        path: '/opportunities/express-interest/:projectId',
        element: <ExpressInterest />
      },
      {
        path: '/jobs',
        element: <Jobs />
      },
      {
        path: '/messages',
        element: <Messages />
      }
    ],
  },
];
