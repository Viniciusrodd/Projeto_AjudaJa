
// hooks
import { createContext, useState } from "react";

// export context
export const MenuContext = createContext();


// provider
export const MenuProvider = ({ children }) =>{
    const [ menu, setMenu ] = useState(false);
    
    return(
        <MenuContext.Provider value={{ menu, setMenu }}>
            { children }
        </MenuContext.Provider>
    )
};