
// libs
import axios from 'axios';


// post requestHelp
export const postRequest = async (data, userID) =>{
    const response = await axios.post(`http://localhost:2130/postRequest/${userID}`, data);
    return response;
};