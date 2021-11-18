import React, { useEffect } from "react";
import { useParams  } from "react-router";
import Input from "../../shared/components/formUI/Input";
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Button from "../../shared/components/formUI/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElement/Card/Card";
const DUMMY_PLACES = [{
    id : 'p1',
    title : 'Empire',
    description : 'One of the most famoue city',
    imageUrl : 'https://live.staticflickr.com/1513/26497574515_91182aa215_b.jpg',
    address : '31 Jurong West Street 41, Singapore 649412',
    location : {
        lat : 123.000,
        lng : 10.00
    },
    creator : 'u1'
},
{
    id : 'p2',
    title : 'Emhihie',
    description : 'eat me baby',
    imageUrl : 'https://live.staticflickr.com/1513/26497574515_91182aa215_b.jpg',
    address : '31 Jurong West Street 41, Singapore 649412',
    location : {
        lat : 123.000,
        lng : 10.00
    },
    creator : 'u2'
}];


const UpdatePlace = () => {
  const placeId = useParams().placeId;

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

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if(identifiedPlace){
    setFormData(
      {
        title: {
          value: identifiedPlace.title,
          isValid: true,
        },
        description: {
          value: identifiedPlace.description,
          isValid: true,
        },
      },
      true
    );
    }
  }, [setFormData, identifiedPlace]);
  
  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  }
  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
        <h2>Could not find place!</h2>;
        </Card>
      </div>
    );
  }

  if (!formState.inputs.title.value){
    return (
      <div className="center">
        <h2>Loading</h2>
      </div>
    )
  }
  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
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
      
    </form>
  );
}

export default UpdatePlace;