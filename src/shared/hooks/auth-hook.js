import { useState,useCallback,useEffect } from "react";


let logoutTimer;

export const useAuth = () =>{
const [token, setToken] = useState(false);
  const [tokenExpirationDate,setTokenExpirationDate] = useState();
  const [userId,setUserId] = useState();

 

  const login = useCallback((userId,token,expirationDate) => {
    setUserId(userId);
    setToken(token);
    const tokenExpiration =expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainTime = tokenExpirationDate.getTime() - new Date().getTime();
     logoutTimer = setTimeout(logout, remainTime)
    }else{
      clearTimeout(logoutTimer);
    }
  },[token,logout,tokenExpirationDate])
  useEffect(()=>{
    const storeData = JSON.parse(localStorage.getItem('userData'));

    if (storeData && storeData.token && new Date(storeData.expiration) > new Date()){
      login(storeData.userId, storeData.token, new Date(storeData.expiration));
    }
  },[login]);

  return { token,login,logout,userId};
}