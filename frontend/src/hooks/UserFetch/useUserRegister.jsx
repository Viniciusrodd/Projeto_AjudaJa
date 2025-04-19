
// libs
import axios from 'axios';

export const userRegister = async (url, data) => {
    const response = await axios.post(url, data);
    return response;
};

