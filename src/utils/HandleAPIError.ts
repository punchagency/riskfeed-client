import { toast } from "sonner";
import API_ENDPOINTS from "@/api/api_endpoints";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HandleAPIError = (error: any, customMessage?: string, showToast: boolean = true) => {
    const status = error.status || error.response?.status;
    const message = error.response?.data?.message || error.message || customMessage || 'Something went wrong';
    const isAuthReq = Object.values(API_ENDPOINTS.auth).some((endpoint) => error.response?.config?.url?.includes(endpoint));
    if (!showToast) return message;
    if (status === 400) {
        toast.error(message);
    } else if (status === 401 && !isAuthReq) {
        toast.error(message || 'Unauthorized');
        // if (typeof window !== 'undefined') {
        //     window.location.href = '/logout';
        // }
    } else if (status === 403) {
        toast.error(message || 'Forbidden');
    } else if (status === 404) {
        toast.error(message || 'Not Found');
    } else if (status === 500) {
        toast.error(message || 'Internal Server Error');
    } else if(status === 429) {
        toast.error(message || "Too many requests, Please try again after some minutes.");
    } else {
        toast.error(message);
    }
    return message;
};

export default HandleAPIError;