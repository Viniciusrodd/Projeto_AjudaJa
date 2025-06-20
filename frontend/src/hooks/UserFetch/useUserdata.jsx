
// hooks
import { useState, useEffect } from 'react';

// libs
import axios from 'axios';

export const useUserdata = (userID) => {
    const [ userData, setUserData ] = useState(null);
    const [ userImage, setUserImage ] = useState(null);
    const [ errorRes, setErroRes ] = useState(null);
    
    const [ allUsersData, setAllUsersData ] = useState(null);
    

    useEffect(() =>{
        const request = async () =>{
            try{
                const res = await axios.get(`http://localhost:2130/user/${userID}`, { withCredentials: true });
                setUserData(res.data.userData);
                setUserImage(res.data.userImage);
            }
            catch(error){
                console.log('Error at useUserData hook request (find user): ', error);
                setErroRes(error);
            }
        }

        if(userID) request();
    }, [userID]);


    useEffect(() =>{
        const requestAllUsers = async () =>{
            try{
                const res = await axios.get(`http://localhost:2130/users`, { withCredentials: true });
                setAllUsersData(res.data.combined_data);
            }
            catch(error){
                console.log('Error at useUserData hook request: (find users)', error);
                setErroRes(error);
            }
        }
        requestAllUsers();
    }, []);


    return { userData, userImage, errorRes, allUsersData };
};