
// libs
import axios from 'axios';

export const useLogOut = async () =>{
    const res = await axios.get('http://localhost:2130/logOut', { withCredentials: true });
    return res;
};