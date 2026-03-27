const API_ENDPOINTS = {
    auth: {
        login: '/api/v1/user/login',
        register: '/api/v1/user/register',
        refreshAccessToken: '/api/v1/user/refresh-token',
        validateToken: '/api/v1/user/validate-token',
        activateAccount: '/api/v1/user/activate-account',
        resendActivationCode: '/api/v1/user/resend-activation-code',
        forgotPassword: '/api/v1/user/forgot-password',
        resetPassword: '/api/v1/user/reset-password',
        resendResetPasswordCode: '/api/v1/user/resend-reset-password-code'
    },
    user: {
        getProfile: '/api/v1/user/profile',
        changePassword: '/api/v1/user/change-password',
        updateProfile: '/api/v1/user/profile',
        logout: '/api/v1/user/logout',
        setTransactionPin: '/api/v1/user/transaction-pin',
        resetTransactionPinCode: '/api/v1/user/reset-transaction-pin-code',
        changeTransactionPin: '/api/v1/user/change-transaction-pin'
    },
    project: {
        createProject: '/api/v1/projects',
        getProjects: '/api/v1/projects',
        getProjectById: '/api/v1/projects/:id',
        updateProject: '/api/v1/projects/:id',
        suggestContractors: '/api/v1/projects/:id/suggest-contractors',
        inviteContractor: '/api/v1/projects/:id/invite-contractor',
        getOpportunities: '/api/v1/projects/opportunities'
    },
    properties: {
        createProperties: '/api/v1/properties',
        updateProperties: '/api/v1/properties/:id',
        getProperties: '/api/v1/properties',
        deleteProperties: '/api/v1/properties/:id',
        getPropertyById: '/api/v1/properties/:id',
        getPropertiesAnalytics: '/api/v1/properties/analytics',
    },
    contractor: {
        getContractors: '/api/v1/contractor',
        getContractorById: '/api/v1/contractor/:id',
    },
    proposals: {
        createProposal: '/api/v1/proposals',
        getProposals: '/api/v1/proposals',
        getJobs: '/api/v1/proposals/jobs',
        getProjectProposals: '/api/v1/proposals/project/:projectId',
        getContractorProposals: '/api/v1/proposals/contractor/:contractorId',
        getProposalById: '/api/v1/proposals/:id',
        updateProposal: '/api/v1/proposals/:id',
        acceptProposal: '/api/v1/proposals/:id/accept',
        rejectProposal: '/api/v1/proposals/:id/reject',
        withdawProposal: '/api/v1/proposals/:id/withdraw',
        getJobStats: '/api/v1/proposals/job-stats',
    },
    messages: {
        createConversation: '/api/v1/messages/conversations',
        getConversations: '/api/v1/messages/conversations',
        getConversationById: '/api/v1/messages/conversations/:id',
        uploadMessageAttachment: '/api/v1/messages/upload-attachments',
    },
    transactions: {
        getTransactions: '/api/v1/transactions',
        getTransactionById: '/api/v1/transactions/:id',
        confirmMilestoneCompleted: '/api/v1/transactions/milestone/:milestoneId/confirm',
        escrowAndPayment: '/api/v1/transactions/escrow',
        escrowPaymentStats: '/api/v1/transactions/escrow/stats'
    },
    wallet: {
        getWalletBalance: '/api/v1/wallet',
        fundWallet: '/api/v1/wallet/fund',
        withdrawWallet: '/api/v1/wallet/withdraw',
        getBankingMethods: '/api/v1/wallet/banking-methods',
        addBankingMethod: '/api/v1/wallet/banking-methods',
        removeBankingMethod: '/api/v1/wallet/banking-methods/:id',
        setDefaultBankingMethod: '/api/v1/wallet/banking-methods/:id/set-default',
    },
    milestones: {
        startMileStone: '/api/v1/milestones/:projectId/:milestoneId/start',
        requestPayment: '/api/v1/milestones/:projectId/:milestoneId/request-payment',
        releasePayment: '/api/v1/milestones/:projectId/:milestoneId/release-payment',
    },
    disputes: {
        getProjectDisputes: '/api/v1/disputes/:projectId',
        resolveDispute: '/api/v1/disputes/:disputeId/resolve',
        raiseDisputeForMilestone: '/api/v1/disputes/:projectId/milestones/:milestoneId',
        respondToDispute: '/api/v1/disputes/:disputeId/respond',
    }
};

export default API_ENDPOINTS;