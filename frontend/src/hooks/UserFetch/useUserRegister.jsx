
// libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react";

export const useUserRegister = (url, data) => {
    const [ success, setSuccess ] = useState('');

    useEffect(() => {
        const fetchRequest = async () =>{
            const response = await axios.post(url, { data });
            if(response.status === 201){
                setSuccess('User created success...');
            }
        };

        fetchRequest();
    }, [url, data]);

    return { success };
};
