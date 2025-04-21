import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

axiosClient.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// axiosClient.interceptors.response.use((res) => {
//   return res.data;
// });

export default axiosClient;
