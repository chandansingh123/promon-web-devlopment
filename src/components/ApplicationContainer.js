import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { lifecycle, compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as actionCreators from 'actions/userActions';
import ProjectContainer from 'components/projects/ProjectContainer';
import AdminContainer from 'components/Admin/AdminContainer';
import UserProfileContainer from 'components/userProfile/UserProfileContainer';
import EmptyContainer from 'components/EmptyContainer';
import 'css/toast.css';


const ApplicationContainer = () => (
  <React.Fragment>
    <Switch>
      <Route path='/profile' component={UserProfileContainer} />
      <Route path='/admin' component={AdminContainer} />
      <Route path='/projects/:code/:section' component={ProjectContainer} />
      <Route path='/' component={EmptyContainer} />
    </Switch>
    <ToastContainer position='bottom-left'  className='toast-container' />
  </React.Fragment>
);

export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  lifecycle({
    componentDidMount() {
      this.props.fetchUserProfile();
    },
    componentWillReceiveProps() {

    }
  })
) (ApplicationContainer);
