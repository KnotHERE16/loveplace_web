import React from 'react';

import Card from '../../shared/components/UIElement/Card/Card';
import './PlaceList.css';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/formUI/Button';

const PlaceList = props => {
    if (props.items.length === 0){
        return (
          <div className="place-list center">
            <Card>
              <h2>No places found. Create One</h2>
              <Button to="/places/new">Share Place</Button>
            </Card>
          </div>
        );
    }
    return (
      <ul className="place-list">
        {props.items.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete ={props.onDeletePlace}
          />
        ))}
      </ul>
    );
}

export default PlaceList;