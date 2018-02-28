import axios from "axios";
import store from "./store";
const fetch = axios.create({
  baseURL: "/api"
});
fetch.interceptors.request.use(config => {
  store.commit("SET_LOADING", true);
  return config;
});
fetch.interceptors.response.use(
  response => {
    store.commit("SET_LOADING", false);
    return response.data;
  },
  error => {
    store.commit("SET_LOADING", false);
    return error;
  }
);

export default fetch;
