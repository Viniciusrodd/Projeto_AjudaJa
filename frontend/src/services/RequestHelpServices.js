
// libs
import axios from 'axios';


// create requestHelp
export const postRequest = async (data, userID) =>{
    const response = await axios.post(`http://localhost:2130/createRequest/${userID}`, data, { withCredentials: true });
    return response;
};


// update requestHelp
export const updateRequest = async (data, requestID) =>{
    const response = await axios.put(`http://localhost:2130/requestUpdate/${requestID}`, data, { withCredentials: true });
    return response
}