import axios from "axios";
import Cookies from 'js-cookie'

// let serviceBaseUrlDev = 'http://localhost:8000/api/';
let serviceBaseUrlProd = 'https://manage.signupcasuals.com:8443/api/'

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


function createAxiosInstance(serviceBaseUrl= 'https://localhost:8443/api/') {

    const axiosInstance = axios.create({
        baseURL: serviceBaseUrl,
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

// const api = createAxiosInstance(serviceBaseUrlDev);
const api = createAxiosInstance(serviceBaseUrlProd);

export default api;
