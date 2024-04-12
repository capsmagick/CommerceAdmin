// Api.js
// import axios from "axios";

// const axiosAPI = axios.create({
//   xsrfCookieName:"csrftoken",
//   xsrfHeaderName:"X-CSRFToken",
//   withCredentials: true,
//   baseURL:"http://localhost:8000",
// });

// axiosAPI.interceptors.response.use(
//   function(response){
//     return response
//   },
//   function(err){
//     return err
//   }
// )

// export default axiosAPI

// Api.js
import axios from "axios";

const axiosAPI = axios.create({
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
  baseURL: "http://manage.signupcasuals.com:8080",
});

// Adding request interceptor to attach CSRF token to outgoing requests
axiosAPI.interceptors.request.use(
  (config) => {
    const method: any = config.method;
    if (method !== "get" || method !== "delete") {
      if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
    }
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) {
      config.headers["X-CSRFToken"] = csrftoken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function getCookie(name: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const possibleValue = parts.pop();
    if (possibleValue) {
      return possibleValue.split(';').shift() || null; // Fix applied here
    }
  }
  return null;

}

export default axiosAPI;
