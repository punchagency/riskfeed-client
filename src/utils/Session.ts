/* eslint-disable @typescript-eslint/no-explicit-any */

const Session = {

    setCookie: (cname: string, cvalue: string) => {
        const d = new Date();
        if (cvalue === '') d.setTime(d.getTime() - (360 * 24 * 60 * 60 * 1000));
        else d.setTime(d.getTime() + (14 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';secure' : '';
        const sameSite = isSecure ? 'Strict' : 'Lax';
        document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=${sameSite}${secureFlag}`;
    },
    getCookie: (cname: string) => {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    },
    clearCookie: (cname: string) => {
        document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    },

    clearAllCookies: () => {
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    },

    get: (key: string) => {
        const val = localStorage.getItem(key) || '';
        if (!val) return null;
        try {
            return JSON.parse(val);
        } catch{
            return null;
        }
    },
    set: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    saveAlert: (value: string, type: 'info' | 'success' | 'warning' | 'error' | 'default' = 'default') => {
        const item = localStorage.getItem('alerts');
        let obj: Record<string, any> = {};
        if (item) {
            obj = JSON.parse(item);
        }
        if (!obj[type]) obj[type] = [];
        obj[type].push(value);
        localStorage.setItem('alerts', JSON.stringify(obj));
    },
    countAlert: () => {
        const items = localStorage.getItem('alerts');
        if (!items) {
            return 0;
        }
        const obj = JSON.parse(items);
        return Object.keys(obj).length;
    },
    remove: (key: string) => {
        localStorage.removeItem(key);
    },
    removeAll: () => {
        localStorage.clear();
    },
};

export default Session;