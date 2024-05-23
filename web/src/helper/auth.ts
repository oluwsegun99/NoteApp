import { useApolloClient } from "@apollo/client";
import jwtDecode, { JwtPayload } from "jwt-decode";
import storage from "local-storage-fallback";
import { useEffect, useState } from "react";
import { EXPRESS_URL } from "..";

const TOKEN = process.env.REACT_APP_TOKEN!;
export const saveToken = (token: string) => storage.setItem(TOKEN, token);
export const getToken = (): string | null => storage.getItem(TOKEN);
export const clearToken = () => storage.removeItem(TOKEN);


export const isAuthenticated = ():boolean => {
    const token = getToken();
    if(!token) return false;

    try {
        const {exp}: JwtPayload = jwtDecode(token);
        if(Date.now() >= exp! * 1000){
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

//Episode 6
export const usePrepareApp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { resetStore } = useApolloClient();

    useEffect(() => {
        fetch(`${EXPRESS_URL}/refresh-token`, {
            method: "POST",
            credentials: "include",
          })
          .then((res) => res.json())
          .then((data) => {
            if(data?.success && data?.access_token){
                saveToken(data?.access_token)
                setIsLoading(false);
            } else {
                clearToken();
                resetStore();
                setIsLoading(false);
            }
          })
    }, []);
    return {isLoading};
};

/* The fetch method will run a post request which will get a response from the specified url...we will take that response and return it in json format.
   We get data back in that response JSON...we then check if the date we get has the "success" message and the access token. If it does then we save the
   access token and we set the loading to false. Else it will clear the token using the clear token function defined above and resetStore which clears
   the store.
    */

 
