/* eslint-disable @typescript-eslint/no-explicit-any */

import Session from './Session';
import { jwtDecode } from "jwt-decode";


export const isLoggedIn = () => {
    const token = Session.getCookie('token');
    if (!token) {
        return false;
    }
    try {
        const decoded: Record<string, any> = jwtDecode(token);
        const isExpired = decoded.exp <= Math.floor(Date.now() / 1000);
        if (isExpired || !decoded.userId) {
            return false;
        }
    } catch {
        return false;
    }
    return true;
};

