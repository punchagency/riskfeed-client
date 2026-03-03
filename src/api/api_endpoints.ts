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
    }
};

export default API_ENDPOINTS;