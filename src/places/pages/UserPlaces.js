import React, { useContext, useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModel from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from '../../shared/context/auth-context';
import { useParams } from 'react-router';

const UserPlaces = () => {
  
    const {isLoading,errorMsg,sendRequest,clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    let userId = useParams().userId;
    const auth = useContext(AuthContext);
    if(userId === 'my'){
        userId = auth.userId;
    }

        useEffect(() => {
        (async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BASE_URL}api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (e) {
            }
        })()
    },[userId,sendRequest])

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(function (prev) {
                return prev.filter(function (place) {
                        return place.id !== deletedPlaceId;
                    });
            }
        );
        
    }
    return (
      <React.Fragment>
          <ErrorModel error={errorMsg} onClear={clearError} />
          {isLoading && (
              <div className="center">
                  <LoadingSpinner />
              </div>
          )}
        {loadedPlaces && (<PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />)}
      </React.Fragment>
    );
}

export default UserPlaces;