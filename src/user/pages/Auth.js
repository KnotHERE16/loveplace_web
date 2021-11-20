import React, { useState, useContext } from "react";
import "./Auth.css";

import Card from "../../shared/components/UIElement/Card/Card";
import Input from "../../shared/components/formUI/Input";
import Button from "../../shared/components/formUI/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, errorMsg, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },

    password: {
      value: "",
      isValid: false,
    },
  });

  const auth = useContext(AuthContext);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    let body = JSON.stringify({
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    });
    let header = {
      "Content-Type": "application/json",
    };

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}api/users/login`,
          "POST",
          body,
          header
        );
        auth.login(responseData.userId);
      } catch (e) {}
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}api/users/signup`,
          "POST",
          JSON.stringify({
            name: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId);
      } catch (e) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMsg} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverylay={true} />}
        <h2>Login</h2>

        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="username"
              type="text"
              label="USER NAME"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />

          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="At least 5 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>

        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
