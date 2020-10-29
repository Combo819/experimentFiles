import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'development'?'http://localhost:5000/':"/";
axios.defaults.baseURL = baseURL

export {axios,baseURL};