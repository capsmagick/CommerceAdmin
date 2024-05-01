import axios from "axios";
import Cookies from 'js-cookie'


let onRejected = function (error) {
    return Promise.reject(error);
};

let csrfToken = '';

const setTokenToHeaders = function (request) {
    if (csrfToken) {
        request.headers['X-CSRFToken'] = csrfToken
    }
}

const getTokenFromResponse = function () {
    csrfToken = Cookies.get('csrftoken');
}


function createAxiosInstance() {

    const axiosInstance = axios.create({
        baseURL: '/api',
        withCredentials: true,
        xsrfHeaderName: 'X-CSRFToken', // Verify this matches the CSRF token header name used in your backend
        xsrfCookieName: 'csrftoken',   // Verify this matches the CSRF token cookie name used in your backend
        headers: {
            Accept: "application/json"
        }
    });

    axiosInstance.interceptors.request.use(
        function (request) {
            const method = request.method;
            if (method !== "get" || method !== "delete") {
                if (typeof FormData !== "undefined" && request.data instanceof FormData) {
                    request.headers["Content-Type"] = "multipart/form-data";
                }
            }
            setTokenToHeaders(request);
            return request;
        }
    )

    axiosInstance.interceptors.response.use(function (response) {
        getTokenFromResponse();
        return response;
    }, onRejected)

    return axiosInstance
}

const api = createAxiosInstance();

export default api;
