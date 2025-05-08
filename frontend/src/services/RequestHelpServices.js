
// libs
import axios from 'axios';


// post requestHelp
export const postRequest = async (data) =>{
    const response = await axios.post('http://localhost:2130/postRequest', data);
    return response;
};