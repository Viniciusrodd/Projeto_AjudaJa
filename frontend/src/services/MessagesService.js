
// libs
import axios from 'axios';


// historical messages
export const messagesBetweenUsers = async (userID) =>{
    const response = await axios.get(`http://localhost:2130/messages/${userID}`, { withCredentials: true });
    return response;
};


// get notifications
export const findNotifications = async () =>{
    const response = await axios.get('http://localhost:2130/notifications', { withCredentials: true });
    return response;
};


// delete notifications
export const deleteNotification = async (userID) =>{
    const response = await axios.delete(`http://localhost:2130/notification/${userID}`, { withCredentials: true });
    return response;    
};