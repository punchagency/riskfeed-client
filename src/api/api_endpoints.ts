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
    }
};

export default API_ENDPOINTS;