import React from 'react';

import ColoredButton from '../Common/ColoredButton';
import CancelButton from '../Common/CancelButton';
import Dialog from '../Common/Dialog';

const styles = {
  userContainer: {
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto'
  },
  userText: {
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '90%',
    textOverflow: 'ellipsis'
  },
  emailText: {
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '90%',
    textOverflow: 'ellipsis',
    color: '#878f9f',
    fontSize: 12,
    fontStyle: 'italic'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10
  }
};

const NewUserList = (props) => {
  const cancelLable = props.users.length ? 'Cancel' : 'Close';

  return (
    <Dialog id="rem-pru-frm-container" show={props.show} resetForm={props.handleCancleClick}>
      <div>

        { !props.users.length && <h4> There are no more users to be added </h4>}

        <div className="mdl-grid" style={styles.userContainer} >
        { props.users.map((user, index) =>
          <div key={index} className="mdl-cell mdl-cell--4-col pm-new-user-wrp" style={{position: 'relative'}} >
            <div className="mdl-list__item-avatar pm-icon-avatar">
              {user.first_name.toUpperCase().charAt(0)}
              {user.last_name.toUpperCase().charAt(0)}
            </div>
            <span style={styles.userText} >{user.first_name} {user.middle_name} {user.last_name}</span>
            <span style={styles.emailText} >{user.email}</span>

            <div style={styles.buttonContainer} >
              <hr/>
              <ColoredButton style={{width:'100%'}} label={'Add User'} onClick={() => props.addUser(user.id)}/>
            </div>
          </div>
        )}
        </div>

        <div style={{height: 40}} >
          <CancelButton label={cancelLable} onClick={props.handleCancleClick} style={{float:'right'}}/>
        </div>
      </div>
    </Dialog>
  );
}
export default NewUserList;
