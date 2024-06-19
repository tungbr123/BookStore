import axios from 'axios';
import { toast } from 'react-toastify';

const api_url = "http://localhost:8080/";

const showToast = (message, options = {}) => {
    const defaultOptions = {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    };

    const toastOptions = { ...defaultOptions, ...options };

    toast.error(message, toastOptions);
};

const api = {
    get: async (url, params, headers = {}) => {
        try {
            const data = await axios.get(api_url + url, { headers: headers, params: params });
            // if (data.data.status != 200) {
            //     throw new Error(data.data.message);
            // }
            return data;
        } catch (e) {
            showToast('Đã có lỗi xảy ra vui lòng thử lại');
            throw e;
        }
    },
    // patch: async (url, params, headers = {}) => {
    //     try {
    //         const data = await axios.patch(api_url + url, { headers: headers, params: params });
    //         return data;
    //     } catch (e) {
    //         showToast(e.message);
    //         throw e;
    //     }
    // },
    patch: async (url, params, headers = {}) => {
        try {
            const data = await axios.patch(api_url + url, params, { headers: headers });
            return data;
        } catch (e) {
            showToast(e.message);
            throw e;
        }
    },
    put: async (url, params, headers = {}) => {
        try {
            const data = await axios.put(api_url + url, params, { headers: headers });
            return data;
        } catch (e) {
            showToast(e.message);
            throw e;
        }
    },
    post: async (url, params, headers = {}) => {
        try {
            const data = await axios.post(api_url + url, params, { headers: headers });
            return data;
        } catch (e) {
            showToast(e.message);
            throw e;
        }
    },
    update: async (url, params, headers = {}) => {
        try {
            const data = await axios.post(url, params, { headers: headers });
            return data;
        } catch (e) {
            throw e;
        }
    },
    delete: async (url, headers = {}) => {
        console.log(headers);
        try {
            const data = await axios.delete(api_url + url, { headers: headers });
            return data;
        } catch (e) {
            showToast(e.message);
            throw e;
        }
    },
};

export default api;

