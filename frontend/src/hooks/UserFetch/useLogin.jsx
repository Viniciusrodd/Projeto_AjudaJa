
// libs
import axios from 'axios';

export const useLogin = async (data) => {
    const response = await axios.post('http://localhost:2130/login', data);
    return response;
};