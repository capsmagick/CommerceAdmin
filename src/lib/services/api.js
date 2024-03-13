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
  const csrftoken = getCookie("csrftoken");
  console.log(csrftoken)
  config.headers["X-CSRFToken"] = csrftoken;
  return config;
});

axiosAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Function to get CSRF token from cookies
function getCookie(name) {
  console.log(document.cookie)
  const value = `; ${document.cookie}`;
  console.log(value)
  let parts = []
  parts = value.split(`; ${name}=`);
  console.log(parts)
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default axiosAPI;
