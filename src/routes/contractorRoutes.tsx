import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardLayout = lazy(() => import('../layout/dashboard-layout'));
const Home = lazy(() => import('../pages/contractor/home'));
const Opportunities = lazy(()=> import('../pages/contractor/opportunities/opportunities'))
const ExpressInterest = lazy(()=> import('../pages/contractor/opportunities/express-interest'))
const Jobs = lazy(()=> import('../pages/contractor/jobs/jobs'));
const Messages = lazy(() => import('@/pages/contractor/messages/messages'));
const Wallet = lazy(() => import('@/pages/contractor/wallet/wallet'));
const AddBankingMethod = lazy(() => import('@/pages/contractor/wallet/add-banking-method'));
const EscrowPayment = lazy(() => import('@/pages/contractor/escrow-payment/escrow-payment'));
const ProjectDisputes = lazy(() => import('@/pages/contractor/escrow-payment/project-dispute'));

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
      },
      {
        path: '/wallet',
        element: <Wallet />
      },
      {
        path: '/wallet/add-banking-method',
        element: <AddBankingMethod />
      },
      {
        path: '/escrow-payments',
        element: <EscrowPayment />
      },
      {
        path: '/escrow-payments/:projectId/disputes',
        element: <ProjectDisputes />,
      }
    ],
  },
];
