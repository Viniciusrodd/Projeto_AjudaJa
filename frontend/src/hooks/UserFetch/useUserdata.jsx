
// hooks
import { useState, useEffect } from 'react';

// libs
import axios from 'axios';

export const useUserdata = (userID) => {
    const [ userData, setUserData ] = useState(null);
    const [ errorRes, setErroRes ] = useState(null);
    const [ userImage, setUserImage ] = useState(null);
    
    useEffect(() =>{
        const request = async () =>{
            try{
                const res = await axios.get(`http://localhost:2130/user/${userID}`, { withCredentials: true });
                setUserData(res.data.userData);
                setUserImage(res.data.userImage);
            }
            catch(error){
                console.log('Error at useUserData hook request: ', error);
                setErroRes(error);
            }
        }

        if(userID) request();
    }, [userID]);

    return { userData, userImage, errorRes };
};