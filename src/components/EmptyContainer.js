
import React from 'react';
import { withRouter } from 'react-router-dom';
import { lifecycle, compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import * as actionCreators from 'actions/userActions';
import { HabitatLogo, AvatarLogo } from 'components/Common/NavbarComponents';


const styles = StyleSheet.create ({
  header: {
    'minHeight': 44,
    backgroundColor: 'rgb(0,175,215)',
    '@media (min-width: 360px)': {
      display: 'block'
    }
  },
});


const EmptyContainer = ({ session }) => {
  // Do not render anything until user's country info is available
  if (!session.country)
    return null;

  return (
    <div className='mdl-layout' style={{minHeight: '100vh'}}>

      <header className={`mdl-layout__header ${css(styles.header)}`}>
        <div className="mdl-layout__header-row" style={{height: 44}}>
          <HabitatLogo />
          <div style={{flexGrow: 1}} />
          <AvatarLogo />
        </div>
      </header>

      <main className="mdl-layout__content">
      </main>
    </div>
  );
};

const navigateToProject = ({ session, setSession, history }) => {
  const projects = session.projects;
  let projectCode;
  if (projects !== undefined && session.projectCode === undefined) {
    projectCode = localStorage.getItem('projectCode');
    if (!projectCode || !projects.find(p => p.code === projectCode))
      projectCode = projects[0].code;
    setSession('projectCode', projectCode);
  }
  if (projectCode) {
    history.push(`/projects/${projectCode}/dashboard`)
  }
};

export default compose (

  connect(
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withRouter,

  lifecycle ({
    componentWillReceiveProps (nextProps) {
      const projects = nextProps.session.projects;
      let projectCode;
      if (projects !== undefined && nextProps.session.projectCode === undefined) {
        projectCode = localStorage.getItem('projectCode');
        if (projects.length > 0 && (!projectCode || !projects.find(p => p.code === projectCode)))
          projectCode = projects[0].code;
        nextProps.setSession('projectCode', projectCode);
      }
      if (this.props.match.path === '/') {
        if (nextProps.session.projectCode)
          this.props.history.push(`/projects/${nextProps.session.projectCode}/dashboard`);
        else if (projectCode)
        this.props.history.push(`/projects/${projectCode}/dashboard`);
        else if (nextProps.session.user && nextProps.session.user.is_admin)
          this.props.history.push('/admin');
      }
    },
    componentDidMount() {
      navigateToProject(this.props);
    }
  })

) (EmptyContainer);
