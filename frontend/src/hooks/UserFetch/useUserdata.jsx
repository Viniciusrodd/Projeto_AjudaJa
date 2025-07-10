
// hooks
import { useState, useEffect, useContext } from 'react';
import { useTokenVerify } from '../UserMiddleware/useTokenVerify'; // custom hook

// libs
import axios from 'axios';

// context
import { LoadingContext } from '../../context/loadingContext';


export const useUserdata = (userID) => {
    // states
    const [ userData, setUserData ] = useState(null);
    const [ userImage, setUserImage ] = useState(null);
    const [ errorRes, setErroRes ] = useState(null);
    const [ allUsersData, setAllUsersData ] = useState(null);
    
    // context + custom hook
    const { userData: userDataLogged } = useTokenVerify();
    const { setLoading } = useContext(LoadingContext);


    useEffect(() =>{
        const request = async () =>{
            setLoading(true);

            try{
                const res = await axios.get(`http://localhost:2130/user/${userID}`, { withCredentials: true });
                if(res.status === 200){
                    setLoading(false);
                    setUserData(res.data.userData);
                    setUserImage(res.data.userImage);
                }
            }
            catch(error){
                console.log('Error at useUserData hook request (find user): ', error);
                setErroRes(error);
                setLoading(false);
            }
        }

        if(userID) request();
    }, [userID]);


    useEffect(() =>{
        const requestAllUsers = async () =>{
            setLoading(true);

            try{
                const res = await axios.get(`http://localhost:2130/users`, { withCredentials: true });
                if(res.status === 204){
                    setLoading(false);
                    setAllUsersData([]);
                    return;
                }

                if(userDataLogged && userDataLogged.id){
                    const filtered = res.data.combined_data.filter((data) => data.id !== userDataLogged.id);
                    setAllUsersData(filtered);
                }
            }
            catch(error){
                console.log('Error at useUserData hook request: (find users)', error);
                setErroRes(error);
                setLoading(false);
            }
        }
        requestAllUsers();
    }, [userDataLogged]);


    return { userData, userImage, errorRes, allUsersData, setAllUsersData };
};