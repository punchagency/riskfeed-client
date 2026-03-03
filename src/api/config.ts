import { type CreateAxiosDefaults } from 'axios';

// Define the environment types
export type ApiEnvironment = 'development' | 'staging' | 'production';

// API Environment Configuration
export const API_ENV = {
  development: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  staging: {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
} as const;

// Get current environment
const getCurrentEnv = (): ApiEnvironment => {
  const env = import.meta.env.VITE_PUBLIC_API_ENV || 'development';
  return env as ApiEnvironment;
};

// API Configuration
export const API_CONFIG: CreateAxiosDefaults = {
  baseURL: API_ENV[getCurrentEnv()].baseURL,

  timeout: API_ENV[getCurrentEnv()].timeout,

  headers: {
    ...API_ENV[getCurrentEnv()].headers,
    'App-Version': '1.0.0',
  },

  withCredentials: true,
  validateStatus: (status: number) => status >= 200 && status < 300,

  responseType: 'json',
};

// Error Codes
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Response Status Codes
export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};