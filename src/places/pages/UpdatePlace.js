import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams  } from "react-router";
import Input from "../../shared/components/formUI/Input";
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Button from "../../shared/components/formUI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElement/Card/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { isLoading , errorMsg,sendRequest,clearError} = useHttpClient();
  const [loadedPlaces,setLoadedPlaces] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState,inputHandler,setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    (async () => {
      try{
      const responseData = await sendRequest(`${process.env.REACT_APP_BASE_URL}api/places/${placeId}`);

      setFormData(
        {
          title: {
            value: responseData.places.title,
            isValid: true,
          },
          description: {
            value: responseData.places.description,
            isValid: true,
          },
        },
        true
      );  

      setLoadedPlaces(responseData.places);
     
      }catch(e){

      }
    })()

  },[placeId,sendRequest,setFormData])
  
  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try{
    await sendRequest(
      `${process.env.REACT_APP_BASE_URL}api/places/${placeId}`,'PATCH',
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      })
    );
    history.push(`/${auth.userId}/places`);
  }catch(e){
    console.log(e);
  }
   
    
   }

   if (isLoading){
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlaces && !errorMsg) {
    return (
      <div className="center">
        <Card>
        <h2>Could not find place!</h2>;
        </Card>
      </div>
    );
  }

 
  return ( 
    <React.Fragment>
      <ErrorModal error={errorMsg} onClear={clearError} />
    {!isLoading && loadedPlaces && (<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description. min 5 char"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
       <Button type="submit" disabled={!formState.isValid}>
           Submit
       </Button>
      
    </form>)}
    </React.Fragment>
  );
}

export default UpdatePlace;