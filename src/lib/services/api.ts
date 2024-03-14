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
  baseURL: "http://localhost:8000",
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

// Function to get CSRF token from cookies
function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  console.log(`Cookie value for ${name}:`, match ? match[2] : "Not Found");
}

export default axiosAPI;
