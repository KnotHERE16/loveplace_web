import React from 'react';
import UserList from '../components/UsersList';

const Users = () => {
    const USERS = [
      {
        id: "u1",
        name: "kel",
        image: "https://asianwiki.com/images/8/82/Ai_Shinozaki-p01.jpg",
        places: 3,
      },
    ];
    return <UserList items={USERS}/>;
};

export default Users;