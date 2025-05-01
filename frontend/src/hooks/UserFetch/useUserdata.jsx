
// libs
import axios from 'axios';

export const useUserdata = async (userID) => {    
    const res = await axios.get(`http://localhost:2130/findUser/${userID}`);
    return res;
};