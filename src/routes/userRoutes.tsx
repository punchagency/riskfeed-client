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
const EditProject = lazy(() => import('@/pages/user/project/edit-project'));
const UpdateProperty = lazy(() => import('@/pages/user/properties/update-property'));
const Contractor = lazy(() => import('@/pages/user/contractor/contractor'));
const Invite = lazy(() => import('@/pages/user/invite/invite'));
const InviteYourContractor = lazy(() => import('@/pages/user/invite/invite-your-contractor'));
const Messages = lazy(() => import('@/pages/user/messages/messages'));
const Wallet = lazy(() => import('@/pages/user/wallet/wallet'));
const AddBankingMethod = lazy(() => import('@/pages/user/wallet/add-banking-method'));
const EscrowPayment = lazy(() => import('@/pages/user/escrow-payment/escrow-payment'));
const ProjectDisputes = lazy(() => import('@/pages/user/escrow-payment/project-dispute'));

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
        path: '/projects/:projectId/edit',
        element: <EditProject />,
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
      {
        path: '/projects/:projectId/invite-your-contractor',
        element: <InviteYourContractor />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/wallet',
        element: <Wallet />,
      },
      {
        path: '/wallet/add-banking-method',
        element: <AddBankingMethod />,
      },
      {
        path: '/escrow-payments',
        element: <EscrowPayment />,
      },
      {
        path: '/escrow-payments/:projectId/disputes',
        element: <ProjectDisputes />,
      }
    ],
  },
  {
    element: <Logout />,
    path: '/logout'
  }
];