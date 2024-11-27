import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUser } from './api';


export const AuthContext = createContext({
    user: {
    },
    token: "",
    setUser: () => {},
    setToken: () => {}
})

function AuthContextProvider({children}) {
    const [user, setUser] = useState({
    });
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (token) {  // Only fetch the user if the token exists
          const fetchUser = async () => {
            try {
              const userData = await getUser(token);  // await the user data
              setUser(userData);  // Set the user data in state
            } catch (error) {
              console.error("Failed to fetch user:", error);
            }
          };
          
          fetchUser();  // Call the async function
        }

      }, [token]);  // Only run when token changestoken

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
export const useAuthContext = () => useContext(AuthContext);
