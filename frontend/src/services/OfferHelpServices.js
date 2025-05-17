
// libs
import axios from 'axios';


// create offerHelp
export const postOffer = async (data, userID, requestID) =>{
    const response = await axios.post(`http://localhost:2130/createOffer/${userID}/${requestID}`, data, { withCredentials: true });
    return response;
};