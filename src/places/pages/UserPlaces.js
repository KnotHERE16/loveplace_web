import React, { useContext, useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModel from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
  
    const {isLoading,errorMsg,sendRequest,clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const auth = useContext(AuthContext);

        useEffect(() => {
        (async () => {
            try{
            const responseData = await sendRequest(`${process.env.REACT_APP_BASE_URL}api/places/user/${auth.userId}`);
            setLoadedPlaces(responseData.places)
            }catch(e){

            }
        })()
    },[auth.userId,sendRequest])

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(function (prev) {
                return prev.filter(function (place) {
                    console.log(place);
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