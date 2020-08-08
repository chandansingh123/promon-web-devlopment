
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import ToolTip from './ToolTip';
import logo from 'images/logo.png';
import logoNoText from 'images/logo-no-text.png';

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

const getLink = (to, label, index, id) => (
  !label.hide() &&
  <Link key={index} id={`${id}-${label.to}`} className={`mdl-navigation__link ${css(styles.menuItems)}`} to={to} >
    {label.to}
  </Link>  
);

const renderProjectName = (code, projectData) => {
  const currentProject = Object.values(projectData).filter( (project) => project.code === code)[0];
  if (currentProject)
    return currentProject.name;
} 

class ProjectList extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return this.props.session.projects === undefined && nextProps.session.projects !== undefined;
  }

  render () {
    if (this.props.session.projects === undefined)
      return null;

    return (
      <ul className='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect' htmlFor='rem-menu-projects'>
        { this.props.session.projects.map(p =>
          <Link id={`rem-menu-projects-${p.code}`} key={`rem-menu-projects-${p.code}`}
              to={`/projects/${p.code}/dashboard`} className={`${css(styles.subMenuItems)}`} >
            <li className='mdl-menu__item' style={{padding: '0px 16px'}}  >
              {p.name}
            </li>
          </Link>
        )}
      </ul>
    );
  }
}


const ReportList = ({projectCode, reports}) => (
  <ul className='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect' htmlFor='rem-menu-reports'>
    { reports.map((p, idx) =>
      <Link id={`rem-menu-reports-${p.code}`} key={idx} to={`/projects/${projectCode}/reports/${p.urlcode}`} className={`${css(styles.subMenuItems)}`} >
        <li className='mdl-menu__item' style={{padding: '0px 16px'}}  >
          {p.name}
        </li>
      </Link>
    )}
  </ul>
);


class NavigationBar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      drawerDisplay: false
    };
  }

  render () {
    const props = this.props;
    const drawerClass = 'mdl-navigation ' + (this.state.drawerDisplay ? `${css(styles.menuContainerVisible)}` : `${css(styles.menuContainer)}`);
    const isAdmin = props.location.pathname.startsWith ('/admin');

    return (
      <header className={`mdl-layout__header ${css(styles.header)}`}>
        <ProjectList session={props.session} />
        <ReportList reports={Object.values(props.reports.data)} projectCode={props.session.projectCode} />

        { this.state.drawerDisplay && <div className={`${css(styles.drawerClickListener)}`} onClick={() => this.setState({drawerDisplay: false})} />}

        <div id='rem-admin-menu' className={`${css(styles.menuHamburger)}`} >
          <button className='mdl-button mdl-js-button' onClick={() => this.setState({drawerDisplay: true})} >
            <i className="material-icons">menu</i>
          </button>
        </div>

        <div className="mdl-layout__header-row" style={{height: 44}}>

          <Link id={`${props.id}-home`} className="mdl-navigation__link" to={props.homeURL} >
            <img  src={logo} style={{maxHeight: 60, maxWidth: 110}} alt="Habitat for Humanity"/>
          </Link>

          <div className="mdl-layout-spacer" id={`${props.id}-project`} style={{display: 'flex', flex: 1, minWidth: 0}}>
            <div style={{flex: 1, overflow: 'hidden', whiteSpace: 'nowrap'}}>
              {renderProjectName(props.session.projectCode, props.projects.data)}
            </div>
          </div>

          <nav className={drawerClass} >
            { this.state.drawerDisplay &&
              <span className={`mdl-layout-title ${css(styles.drawerLogo)}`}>
                <img  src={logoNoText} style={{maxHeight: 100, maxWidth: 130}} alt="Habitat for Humanity"/>
              </span> }
            { Object.keys(props._navigations).map( (_key,index) => getLink( _key, props._navigations[_key], index, props.id ) )}
            {
              !isAdmin && props.session.projects && props.session.projects.length > 0 &&
                <Link id='rem-menu-reports' className={`mdl-navigation__link ${css(styles.menuItems)}`} to='#'>Reports</Link>
            }
            {
              !isAdmin && props.session.projects && props.session.projects.length > 0 &&
                <Link id='rem-menu-projects' className={`mdl-navigation__link ${css(styles.menuItems)}`} to='#'>Projects</Link>
            }
            <div style={{flexGrow: 1}}/>
          </nav>

          <div style={{position: 'relative'}}>
            <button id={`${props.id}-avatar`} className="mdl-button mdl-js-button mdl-button--icon" onClick={() => props.toggleAccountToolTip()}>
              { props.session.user && props.session.user.avatar ?
                <div style={{marginLeft: -3}}>
                  <img src={props.session.user.avatar} alt='Avatar' style={{maxWidth: 38, maxHeight: 38}} />
                </div> :
                <i className="material-icons">account_circle</i>
              }
            </button>

            { props.ui.displayAccountToolTip && <ToolTip /> }
          </div>

        </div>
      </header>
    );
  }
}

export default withRouter(NavigationBar);
