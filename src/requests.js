const APIURL = 'http://localhost:3000';
const axios = require('axios');
export const getPasswords = () => axios.get(`${APIURL}/passwords`);
export const addPassword = (data) => axios.post(`${APIURL}/passwords`, data);
export const editPassword = (data) => axios.put(`${APIURL}/passwords/${data.id}`, data);
export const deletePassword = (id) => axios.delete(`${APIURL}/passwords/${id}`);