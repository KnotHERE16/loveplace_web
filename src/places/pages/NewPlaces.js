import React, { useContext } from "react";

import Input from "../../shared/components/formUI/Input";
import Button from "../../shared/components/formUI/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router";

const NewPlaces = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const {isLoading,errorMsg,sendRequest,clearError} = useHttpClient();
  const history = useHistory();

  const placeSubmitHandler = async (event) =>{

    event.preventDefault();

   
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}api/places`,
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      history.push('/:userId/places');
      //redirect
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <React.Fragment>
      <ErrorModal error={errorMsg} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter at least 5 chac"
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="textarea"
        label="Address"
        validators={[VALIDATOR_REQUIRE]}
        errorText="Please enter a valid address"
        onInput={inputHandler}
      />
      

      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlaces;
