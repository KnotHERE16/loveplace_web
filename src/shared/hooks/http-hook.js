import { useState, useCallback, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState();

  const activeHttpRequest = useRef([]);

  const auth = useContext(AuthContext);

  const sendRequest = useCallback(
    async (url, method = "GET", body = undefined, addHeaders = {"Content-Type": "application/json"}) => {
      setIsLoading(true);
      let headers = {
        "Content-Type": "application/json",
      };
      if (auth.token) {
        headers["Authorization"] = "Bearer " + auth.token;
      }

      if (addHeaders === "formdata") {
        delete headers["Content-Type"];
      }else if(addHeaders['Content-Type'])
      {
        headers["Content-Type"] = addHeaders['Content-Type'];
      }

      
      const httpAbortController = new AbortController();
      activeHttpRequest.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
          signal: httpAbortController.signal,
        });
        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );
        setIsLoading(false);
        if (!response.ok) {
          throw new Error(responseData.message || "something went wrong");
        }
        return responseData;
      } catch (e) {
        if (!httpAbortController.signal.aborted) {
          setIsLoading(false);
          setErrorMsg("fetch error : " + e.message);
          throw e;
        }
      }
    },
    [auth.token]
  );

  const clearError = () => {
    setErrorMsg(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading: isLoading, errorMsg: errorMsg, sendRequest, clearError };
};
