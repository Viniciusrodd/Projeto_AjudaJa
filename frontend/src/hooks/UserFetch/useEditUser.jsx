
// libs
import axios from 'axios';

export const useEditUser = async (userID, data) => {
    const response = await axios.put(`http://localhost:2130/updateUser/${userID}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response;
};