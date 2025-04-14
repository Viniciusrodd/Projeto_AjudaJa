
// libs
import axios from 'axios';

// hooks
import { useState, useEffect } from "react";

export const useFetchTest = (URL) => {
    const [ message, setMessage ] = useState(null);

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await axios.get(URL);
                setMessage(response.data.msg);
            }
            catch(error){
                console.log('error at fetch data: ', error);
            };
        };
        fetchData();
    }, [URL]);

    return { message };
};