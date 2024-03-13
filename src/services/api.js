// Api.js
import axios from "axios";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL: " http://127.0.0.1:8000/", // it's not recommended to have this info here.
});

// implement a method to execute all the request from here.
const apiRequest = (method, url, request) => {
  const headers = {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwMjcxNjkxLCJpYXQiOjE3MTAyNjgwOTEsImp0aSI6IjllYzNjOTMyNzlkNDRhYTRiNmY2ZWY4YzAwYzlmNWU1IiwidXNlcl9pZCI6Mn0.7B9PBFlvwT9QSPx9eaMSwqX3SUU6dB_gjsxVbfwJLFs",
  };
  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method,
    url,
    data: request,
    headers,
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// function to execute the http get request
const get = (url, request) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url, request) => apiRequest("delete", url, request);

// function to execute the http post request
const post = (url, request) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url, request) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url, request) => apiRequest("patch", url, request);

// expose your method to other services or actions
const API = {
  get,
  delete: deleteRequest,
  post,
  put,
  patch,
};
export default API;
