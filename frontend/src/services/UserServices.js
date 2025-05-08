
// libs
import axios from 'axios';


// user register
export const userRegister = async (url, data) => {
    const response = await axios.post(url, data);
    return response;
};


// user login
export const useLogin = async (data) => {
    const response = await axios.post('http://localhost:2130/login', data, {
        withCredentials: true
    });
    return response;
};


// user edit
export const useEditUser = async (userID, data) => {
    const response = await axios.put(`http://localhost:2130/updateUser/${userID}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response;
};


// user logout
export const useLogOut = async () =>{
    const res = await axios.get('http://localhost:2130/logOut', { withCredentials: true });
    return res;
};


// user delete
export const useDeleteUser = async (userID) =>{
    const response = await axios.delete(`http://localhost:2130/deleteUser/${userID}`, { withCredentials: true })
    return response;
};