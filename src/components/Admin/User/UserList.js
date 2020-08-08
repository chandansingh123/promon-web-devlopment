import React from 'react';

import UserDetail from './UserDetail';

const UserList = (props) =>(
  <div className='pm-user-wrp'>
    <ul className="pm-user-list-ul mdl-list">
      {props.users.map((user,index) => <UserDetail handleDeleteClick={props.handleDeleteClick} roles={props.roles} key={index} user={user}/>)}
    </ul>
  </div>
);

export default UserList;
