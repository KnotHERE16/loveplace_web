import React from 'react';

import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router';
const Dummy_place = [{
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
    title : 'Empire',
    description : 'One of the most famoue city',
    imageUrl : 'https://live.staticflickr.com/1513/26497574515_91182aa215_b.jpg',
    address : '31 Jurong West Street 41, Singapore 649412',
    location : {
        lat : 123.000,
        lng : 10.00
    },
    creator : 'u2'
}];

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = Dummy_place.filter(place => place.creator === userId);
    return <PlaceList items={loadedPlaces} />;
}

export default UserPlaces;