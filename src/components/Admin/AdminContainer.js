import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lifecycle, compose } from 'recompose';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import * as actionCreators from 'actions';

import AppConfig from 'components/Admin/AppConfig';
import AdminDashboard from './AdminDashboard';
import OmkSurvey from 'components/Admin/OmkSurvey';
import SurveyDetail from 'components/Admin/OmkSurvey/SurveyDetail';
import SurveyUpload from 'components/Admin/OmkSurvey/SurveyUpload';
import SurveyCrud from 'components/Admin/OmkSurvey/SurveyCrud';
import SurveyDownload from 'components/Admin/OmkSurvey/SurveyDownload';
import Project from 'components/Admin/Project';
import Reports from 'components/Admin/reports';
import User from 'components/Admin/User';
import Tenent from 'components/Admin/Tenent';
import PageNotFound from 'components/Common/PageNotFound';
import Role from 'components/Admin/Role';
import ErrorHandler from 'components/Common/ErrorHandler';
import { HabitatLogo, AvatarLogo } from 'components/Common/NavbarComponents';


const commonStyles = {
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 240,
    backgroundColor: 'white',
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    zIndex: 10,
    transition: 'transform 200ms ease-in-out'
  }
};

const styles = StyleSheet.create ({
  header: {
    'minHeight': 44,
    backgroundColor: 'rgb(0,175,215)',
    '@media (min-width: 360px)': {
      display: 'block'
    }
  },
  menuItems: {
    height: 46, lineHeight: '46px',
    ':hover': {
      textDecoration: 'none',
      backgroundColor: 'rgb(0,125,165)'
    },
    ':visited': {
      textDecoration: 'none'
    },
    ':active': {
      textDecoration: 'none'
    },
    ':focus': {
      textDecoration: 'none'
    },
    '@media (max-width: 992px)': {
      color: '#757575',
      width: '100%',
      padding: '16px 40px',
      lineHeight: '18px',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#dddddd'
      }
    }
  },
  subMenuItems: {
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'none',
    }
  },
  menuContainer: {
    display: 'flex',
    '@media (min-width: 992px)': {
      maxWidth: 605
    },
    '@media (max-width: 992px)': {
      ...commonStyles.menuContainer,
      transform: 'translateX(-240px)'
    },
  },
  menuContainerVisible: {
    '@media (max-width: 992px)': {
      ...commonStyles.menuContainer,
    }
  },
  menuHamburger: {
    '@media (min-width: 992px)': {
      display: 'none'
    },
    '@media (max-width: 992px)': {
      position: 'absolute', left: 15, top: 4
    }
  },
  drawerClickListener: {
    position: 'absolute', top: 0, left: 0,
    width: '100vw', height: '100vh',
    zIndex: 4,
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  drawerLogo: {
    backgroundColor: '#FF671F',
    width: '100%', height: 200,
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  }
});

class Admin extends React.Component {

  componentWillMount () {
    this.props.fetchCountries();
    this.props.fetchRoles ();
    this.props.fetchPermission ();
    this.props.fetchUsers ();
    this.props.fetchOmkSurveys ();
    this.props.fetchAllProjects();
  }

  componentDidUpdate () {
    window.componentHandler.upgradeAllRegistered();

    const mdlElements = document.querySelectorAll('.mdl-textfield');
    mdlElements.forEach (el => {
      try {
        el.MaterialTextfield && el.MaterialTextfield.checkDirty();
      } catch (err) {
      }
    });
  }

  render () {
    const _props  = this.props;
    const menu = [
      {text: 'User',       to: '/admin/user'},
      {text: 'Role',       to: '/admin/role'},
      {text: 'OMK Survey', to: '/admin/surveys'},
      {text: 'Project',    to: '/admin/project'},
      {text: 'Reports',    to: '/admin/reports'}
    ];

    return (
      <div className='mdl-layout' style={{minHeight: '100vh'}}>

        <header className={`mdl-layout__header ${css(styles.header)}`}>
          <div className="mdl-layout__header-row" style={{height: 44}}>
            <HabitatLogo />
            <div style={{flexGrow: 1}} />
            { menu.map((m, idx) => (
              <Link key={idx} id={`rem-navbar-${m.text}`} className={`mdl-navigation__link ${css(styles.menuItems)}`} to={m.to} >
                {m.text}
              </Link>
            ))}
            <AvatarLogo />
          </div>
        </header>

        <main className="mdl-layout__content">

          <Switch>
            <Route path='/admin/app' render = {(props) => <ErrorHandler><AppConfig {..._props}/></ErrorHandler> } />
            <Route exact path='/admin/surveys/:id/upload' render = {(props) => <ErrorHandler><SurveyUpload {..._props} surveyId={props.match.params.id} /></ErrorHandler> } />
            <Route exact path='/admin/surveys/:id/data' render={() => <SurveyCrud />} />
            <Route exact path='/admin/surveys/:id/data/download' render={() => <SurveyDownload />} />
            <Route exact path='/admin/surveys/:id' render = {(props) => <ErrorHandler><SurveyDetail {..._props} surveyId={props.match.params.id} /></ErrorHandler> } />
            <Route path='/admin/surveys' render = {(props) => <ErrorHandler><OmkSurvey {..._props}/></ErrorHandler> } />
            <Route path='/admin/project' render = {(props) => <ErrorHandler><Project {..._props}/></ErrorHandler> } />
            <Route exact path='/admin/role' render = {(props) => <ErrorHandler><Role {..._props}/></ErrorHandler> } />
            <Route exact path='/admin/user' render = {_ => <ErrorHandler><User /></ErrorHandler> } />
            <Route exact path='/admin/country' render = {(props) => <ErrorHandler><Tenent {..._props}/></ErrorHandler> } />
            <Route exact path='/admin/reports'>
              <ErrorHandler><Reports /></ErrorHandler>
            </Route>
            <Route exact path='/admin' render = {(props) => <ErrorHandler><AdminDashboard {..._props}/></ErrorHandler> } />
            <Route component={PageNotFound}/>
          </Switch>
        </main>
      </div>
    );
  }
}


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  lifecycle({
    componentDidMount() {
      this.props.fetchUserProfile();
    }
  })
) (Admin);
