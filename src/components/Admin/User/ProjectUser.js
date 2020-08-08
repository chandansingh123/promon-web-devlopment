// TODO - this file is no longer being used. can be deleted.
import React from 'react';
import dialogPolyfill from 'dialog-polyfill';

import HeaderWithAddButton from '../Common/HeaderWithAddButton';
import ConfirmationPopUp from '../../Common/ConfirmationpopUp';
import UserList from './UserList'; 
import NewUsersList from './NewUsersList';
import * as Utils from 'utils/Utils';
import Loading from '../../Common/Loading';

class ProjectUser extends React.Component{

  componentWillMount () {
    this.props.fetchUsers();
    this.props.fetchRoles();
  }

  handleAddClick () {
    this.props.addProjectUserStart();
  }

  handleAddUser(id){
      const savePayLoad = {user:id}
      const projectCode  = this.props.match.params.projectCode;
      const projectId =  Utils.getIdByValue(projectCode, Object.values(this.props.projects.data), 'code');
      this.props.saveProjectUser(projectCode, projectId, savePayLoad, 'users');
  }

  _getUserIndex(userId, projectId){
      return this.props.projects.data[projectId].users.indexOf(userId);
  }

  handleDeleteClick(id){
      let dialog = document.getElementById('pm-project-user-delete');

      const projectCode  = this.props.match.params.projectCode;
      const projectId =  Utils.getIdByValue(projectCode, Object.values(this.props.projects.data), 'code');
      const index = this._getUserIndex(id, projectId);

      document.getElementsByTagName("BODY")[0].appendChild(dialog);
      dialogPolyfill.registerDialog(dialog);
      dialog.querySelector('#success').onclick = function(event) {
        event.preventDefault();
        this.props.removeProjectUser(projectCode, projectId, 'users', id, index);
        dialog.close();
      }.bind(this);

      dialog.querySelector('#cancel').onclick =  function() {
        dialog.close();
      };
      dialog.showModal();
  }

  render () {
    if (this.props.users.isFetching)
      return <Loading style={{height:'80vh'}} viewBox='0 0 38 38'/>;

    const projectCode  = this.props.match.params.projectCode;
    const projectId =  Utils.getIdByValue(projectCode, Object.values(this.props.projects.data), 'code');
    const currentProject = this.props.projects.data[projectId];
    const projectUserList =  Object.keys (this.props.users.data).length !== 0  ? currentProject.users.map (uid => this.props.users.data[uid]) : [];
    const newUsersList = Object.values(this.props.users.data).filter( user => !projectUserList.includes(user));

    return (
      <div>
        <HeaderWithAddButton  id='rem-pru-header' headerText='Users' handleAddClick={this.handleAddClick.bind(this)}/>
          <NewUsersList handleCancleClick={this.props.projectUserAddCancel}
              users={newUsersList}
              show={this.props.projects.newData.userEditing}
              addUser={this.handleAddUser.bind(this)}/>

          <UserList id='rem-pru-tbl' roles={this.props.role.data} users={projectUserList} handleDeleteClick={this.handleDeleteClick.bind(this)}/>

          <ConfirmationPopUp id="pm-project-user-delete" title="Confirm"
           message="Are you certain that you want to delete this User."
           subMessage=" You can't undo this action."
           successButtonText="Yes" cancelButtonText="No"/>
        </div>
      );
  }
}

export default ProjectUser;