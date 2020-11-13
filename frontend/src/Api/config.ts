import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'development'?'http://localhost:80':"";
axios.defaults.baseURL = baseURL

export {axios,baseURL};