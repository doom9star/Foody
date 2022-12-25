import axios from "axios";

export const CAxios = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
