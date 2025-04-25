
// hooks
import { useState, useEffect } from 'react';

// libs
import axios from 'axios';

export const useUserdata = (userID) => {
    const [ userData, setUserData ] = useState(null);

    useEffect(() => {
        const fetch = async () =>{
            try {
                const res = await axios.get(`http://localhost:2130/findUser/${userID}`);
                setUserData(res.data.userData);
            } catch (err) {
                console.error('Error at find user in axios hook request:', err);
            }
        }
        fetch();
    }, [userID]);

    return { userData };
};