
// libs
import axios from 'axios';


// historical messages
export const messagesBetweenUsers = async (userID) =>{
    const response = await axios.get(`http://localhost:2130/messages/${userID}`, { withCredentials: true });
    return response;
};