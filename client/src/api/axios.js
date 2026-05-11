//Now instead of writing full URL:
//http://localhost:5000/api/comments
//You can write->"/comments"

import axios from "axios";//axios lib.-->Axios is used to:send HTTP requests,communicate with backend APIs

const API = axios.create({
  baseURL: "http://localhost:5000/api"//custom Axios object.👉 Instead of writing full URL every time, you set a default base URL.
});

API.interceptors.request.use((req) => { //Axios interceptor->add token to every req automatically
  //interceptors.request.use(...) means: 👉 “Before every API request is sent, run this function first.”
  
  const token = localStorage.getItem("token");//Gets saved login token from browser localStorage.

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;//Adds token inside request headers.
  }

  return req;//Returns modified request so Axios can send it.
});


export default API;