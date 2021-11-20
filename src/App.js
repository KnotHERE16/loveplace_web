import React, { useState, useCallback } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlaces from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId,setUserId] = useState();
  const login = useCallback((userId) => {
    setUserId(userId);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/my/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
       <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
          </Route>
          <Route path="/auth" exact>
            <Auth />
          </Route>
          <Redirect to="/auth" />
        
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout ,userId:userId}}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>  
        {routes}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
