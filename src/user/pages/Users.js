import React, { useState, useEffect } from "react";
import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";
const Users = () => {
  const {isLoading,errorMsg,sendRequest,clearError} = useHttpClient();
  
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    (async () => {
      
      try {
       const responseData = await sendRequest(`${process.env.REACT_APP_BASE_URL}api/users`)

        setLoadedUsers(responseData.users);
      } catch (e) {}
    })();
  }, [sendRequest]);
  return (
    <React.Fragment>
      <ErrorModal error={errorMsg} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
