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
  xsrfCookieName:"csrftoken",
    xsrfHeaderName:"X-CSRFToken",
    withCredentials: true,
  baseURL: "http://localhost:8000",
});

// Adding request interceptor to attach CSRF token to outgoing requests
axiosAPI.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
}, error => Promise.reject(error));

axiosAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Function to get CSRF token from cookies
// function getCookie(name: string): string | undefined {
 
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   if (match) return match[2];
//   console.log(`Cookie value for ${name}:`, match ? match[2] : 'Not Found');
// }
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