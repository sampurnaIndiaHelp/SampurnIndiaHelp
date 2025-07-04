import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async ( userId, password) => {
  return axios.post(`${API_URL}/api/users/login`, {
    userId,
    password,
  });
};
