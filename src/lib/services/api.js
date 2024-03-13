// Api.js
import axios from "axios";

const axiosAPI = axios.create({
  xsrfCookieName:"csrftoken",
  xsrfHeaderName:"X-CSRFToken",
  withCredentials: true,
  baseURL:"http://localhost:8000",
  
});

axiosAPI.interceptors.response.use(
  function(response){
    return response
  },
  function(err){
    return err
  }
)

export default axiosAPI