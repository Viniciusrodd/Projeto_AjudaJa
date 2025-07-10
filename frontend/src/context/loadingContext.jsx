
// hooks
import { createContext, useState, useEffect } from "react";

// export context
export const LoadingContext = createContext();


// provider
export const LoadingProvider = ({ children }) =>{
    const [ loading, setLoading ] = useState(null);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            { children }
        </LoadingContext.Provider>
    )
};