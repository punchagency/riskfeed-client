import type { ErrorEvent, EventHint, SeverityLevel } from "@sentry/types";
import * as Sentry from "@sentry/react";

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
  tracePropagationTargets: (string | RegExp)[];
  beforeSend: (event: ErrorEvent, hint: EventHint) => ErrorEvent | null;
  initialScope: {
    tags: Record<string, string>;
  };
}

export const sentryConfig: SentryConfig = {
  // Your Sentry DSN - get this from your Sentry project settings
  dsn: import.meta.env.VITE_SENTRY_DSN || "",

  // Environment configuration
  environment: import.meta.env.VITE_MODE || "development",

  // Performance monitoring sample rates
  tracesSampleRate: import.meta.env.VITE_MODE === "production" ? 0.1 : 1.0,

  // Session replay configuration
  replaysSessionSampleRate: 0.1, // 10% of sessions recorded
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors recorded

  // API domains for performance tracing (update these with your actual API domains)
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/ycc-servers-82e51814e1e5\.herokuapp\.com\/api/,
  ],

  // Filter and sanitize events before sending
  beforeSend(event: ErrorEvent): ErrorEvent | null {
    if (event.exception) {
      const errorMessage = event.exception.values?.[0]?.value;

      // Ignore specific known non-critical errors
      const ignoredErrors = [
        "hideOverlaysOnDocumentScrolling",
        "ResizeObserver loop limit exceeded",
        "Non-Error promise rejection captured",
        "Network Error",
        "Loading chunk",
        "Loading CSS chunk",
      ];

      if (errorMessage && ignoredErrors.some(msg => errorMessage.includes(msg))) {
        return null;
      }
    }

    return event;
  },

  // Initial context or tags
  initialScope: {
    tags: {
      component: "react-app",
    },
  },
};

// Helper function to set user context
interface SentryUser {
  id: string | number;
  email: string;
  username?: string;
}

export const setSentryUser = (user: SentryUser): void => {
  if (typeof window !== "undefined") {
    Sentry.setUser({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
    });
  }
};

// Helper function to add a breadcrumb
export const addSentryBreadcrumb = (
  message: string,
  category: string = "custom",
  level: SeverityLevel = "info"
): void => {
  if (typeof window !== "undefined") {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }
};

// Helper function to capture exceptions with context
export const captureException = (
  error: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: Record<string, any> = {}
): void => {
  if (typeof window !== "undefined") {
    Sentry.withScope(scope => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  }
};
