import { useState,useCallback, useRef,useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading,setIsLoading] = useState(false);

    const [errorMsg,setErrorMsg] = useState();

    const activeHttpRequest = useRef([]);
    
    const sendRequest = useCallback(async (url ,method = 'GET' , body = null, headers = {"Content-Type": "application/json"}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequest.current.push(httpAbortController);
        try {
            const response = await fetch(
              url,
              {
                method: method,
                headers: headers,
                body: body,
                signal:httpAbortController.signal
              }
            );
            const responseData = await response.json();

            activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortController);
            setIsLoading(false);
            if (!response.ok) {
              throw new Error(responseData.message || "something went wrong");
            }
            return responseData;
          } catch (e) {
            setIsLoading(false);
            setErrorMsg('fetch error : ' + e.message);
            throw e;
          }
          
          
    },[]);

    const clearError = () => {
        setErrorMsg(null);
    }
    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortCtrl => {
                abortCtrl.abort();
            })
        }
    },[]);

    return  { isLoading:isLoading,errorMsg:errorMsg,sendRequest,clearError};
}