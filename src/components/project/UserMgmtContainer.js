import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserMgmtTable from './UserMgmtTable';
import UserMgmtForm from './UserMgmtForm';

const UserMgmt = ({ mode }) => (
  <Fragment>
    { mode === 'edit' ? <UserMgmtForm /> : <UserMgmtTable /> }
  </Fragment>
);


export default compose (

  connect(
    state => ({
      mode: state.projectUsers.newData && state.projectUsers.newData.editing ? 'edit' : 'display'
    }),
    null
  ),

) (UserMgmt);
