
// libs
import axios from 'axios'

export const useTokenVerify = async () => {
    const res = await axios.post('http://localhost:2130/verifyToken', {}, { withCredentials: true });
    return res;
};