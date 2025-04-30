

// libs
import axios from 'axios';

export const useDeleteUser = async (userID) =>{
    const response = await axios.delete(`http://localhost:2130/deleteUser/${userID}`, { withCredentials: true })
    return response;
};