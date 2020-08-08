import React from 'react';

const UserDetail = ({user, handleDeleteClick, roles}) => {

  if (!user)
    return null;

  let userRoles = [];

  !!Object.values(roles).length && user.roles.map( role => userRoles.push(roles[role].name));

  return (
    <li className="mdl-list__item mdl-list__item--two-line pm-user-list">
      <span className="mdl-list__item-primary-content">
        <div className="mdl-list__item-avatar pm-icon-avatar">
          {user.first_name.toUpperCase().charAt(0)}
          {user.last_name.toUpperCase().charAt(0)}
        </div>
        <span>{user.first_name} {user.middle_name} {user.last_name}</span>
        <span className="mdl-list__item-sub-title">
          <span className='pm-new-user-email-container' style={{width:'70%'}}>{user.email}</span>
          <span className='pm-user-role-container'>{userRoles.join(', ')}</span>
        </span>
      </span>
      <span className="mdl-list__item-secondary-content">
        <button className="mdl-button mdl-js-button mdl-button--icon pm-delete-button" onClick={() =>{handleDeleteClick(user.id)}}>
          <i className="material-icons">delete_forever</i>
        </button>
      </span>
    </li>
  );
}

export default UserDetail;