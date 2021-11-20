import React from 'react';
import  UserItem  from './UserItem';
import Card from '../../shared/components/UIElement/Card/Card';
import './UsersList.css';

const UserList = (props) => {
    if(props.items.length === 0){
        return (<Card className="center">
            <h2>No user found.</h2>
        </Card>);
    }

    return (
      <ul className="users-list">
        {props.items.map((user) => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        ))}
      </ul>
    );
};

export default UserList;