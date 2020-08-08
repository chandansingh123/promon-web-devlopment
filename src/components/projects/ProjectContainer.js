
import React from 'react';
import { Switch } from 'react-router';
import { Route, withRouter } from 'react-router-dom';
import { lifecycle, compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import * as actionCreators from 'actions/userActions';
import ProjectDashboard from './ProjectDashboard';
import MgmtContainer from 'components/project/MgmtContainer';
import GeoMap from 'components/Map';
import GeoTable from 'components/Table';
import ChartContainer from 'components/Chart/ChartContainer';
import DataApproval from 'components/Table/DataApproval';
import SurveyForm from 'components/project/SurveyForm';
import ReportsContainer from 'components/reports/ReportsContainer';
import { HabitatLogo, AvatarLogo } from 'components/Common/NavbarComponents';
import Drawer from 'components/Map/Drawer';
import { PERMISSIONS, hasPermission } from 'utils/permissions';


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
    padding: '0 12px',
    borderLeft: 'rgba(255, 255, 255,.3) solid 1px',
    borderRight: 'rgba(255, 255, 255,.3) solid 1px',
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
  },
  obfuscator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    pointerEvents: 'auto',
    position: 'absolute', top: 0, left: 0,
    height: '100%', width: '100%',
    zIndex: 4,
  },
  projectSelector: {
    padding: 10,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#ddd'
    }
  }
});


const ProjectSelector = ({ projects, cancelSelectProject, selectProject }) => (
  <div>
    <div className={`${css(styles.obfuscator)}`} onClick={cancelSelectProject} />
    <div style={{zIndex: 10, position: 'absolute', width: '100vw', height: '100vh', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div style={{ boxShadow: 'rgba(0, 0, 0, 0.23) 0px 20px 75px',  minWidth: 250, backgroundColor: 'white' }} >
        <h3 style={{background: 'rgb(40, 186, 230)', lineHeight: 1.4, color: 'white', marginTop: 0, marginBottom: 5, padding: '10px 20px', fontSize: '24px'}}>
          Switch Project
        </h3>
        <div style={{ maxHeight: '50vh', overflowY: 'auto'}}>
          { projects.map(p =>
            <div id={`rem-menu-Projects-${p.code}`} key={`rem-menu-Projects-${p.code}`} className={`${css(styles.projectSelector)}`}
              onClick={() => selectProject(p.code)}>
              {p.name}
            </div>
          )}
        </div>
        <div style={{borderTop: '1px solid rgba(0, 0, 0, 0.2)', textAlign: 'center'}}>
          <button onClick={cancelSelectProject}
            style={{width: 100, padding: 10, border: '1px solid rgb(255, 255, 255)', margin: 10, cursor: 'pointer', background: 'rgb(63, 81, 181)',
            color: 'rgb(255, 255, 255)', fontSize: '14p'}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);


const ReportList = ({projectCode, reports}) => (
  <ul className='mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect' htmlFor='rem-menu-Reports'>
    { reports.map(p =>
      <Link id={`rem-menu-reports-${p.urlcode}`} key={p.urlcode} to={`/projects/${projectCode}/reports/${p.urlcode}`} className={`${css(styles.subMenuItems)}`} >
        <li className='mdl-menu__item' style={{padding: '0px 16px'}}  >
          {p.name}
        </li>
      </Link>
    )}
  </ul>
);


const ProjectContainer = ({ match, session, projects, ui, setUi, reports, cancelSelectProject, selectProject }) => {
  const section = match.params.section;
  const tableStyle = {display: section === 'table' ? 'block' : 'none'};
  const mapStyle = {display: section === 'map' ? 'block' : 'none'};
  const chartStyle = {display: section === 'chart' ? 'block' : 'none'};

  // Do not render anything until user's country info is available
  if (!session.country)
    return null;

  const projectCode = session.projectCode;
  const isAdmin = session.user && session.user.is_admin;

  const menu = [
    {text: 'Admin',   to: '/admin', if: isAdmin},
    {text: 'Map',     to: `/projects/${projectCode}/map`, if: true},
    {text: 'Table',   to: `/projects/${projectCode}/table`, if: true},
    {text: 'Chart',   to: `/projects/${projectCode}/chart`, if: true},
  ];

  const currentProject = session.projects.find(p => p.code === projectCode);
  const projectPermissions = currentProject ? currentProject.permissions : [];
  const accessibleReports = currentProject ? Object.values(reports.data).filter(r => currentProject.reports.indexOf(r.urlcode) > -1) : [];

  return (
    <div className='mdl-layout' style={{minHeight: '100vh'}}>

      <header className={`mdl-layout__header ${css(styles.header)}`}>
        { ui['map.drawerShow'] &&
          <div className={`${css(styles.drawerClickListener)}`} onClick={() => setUi('map.drawerShow', false)} />
        }

        <div className="mdl-layout__header-row" style={{height: 44}}>
          <HabitatLogo />

          <div className="mdl-layout-spacer" id='rem-menu-project-name' style={{display: 'flex', flex: 1, minWidth: 0}}>
            <div style={{flex: 1, overflow: 'hidden', whiteSpace: 'nowrap'}}>
              { currentProject && currentProject.name }
            </div>
          </div>

          { menu.filter(m => m.if).map(m => (
            <Link key={m.text} id={`rem-navbar-${m.text}`} className={`mdl-navigation__link ${css(styles.menuItems)}`} to={m.to} >
              {m.text}
            </Link>
          ))}

          <ReportList reports={accessibleReports} projectCode={projectCode} />
          <Link id='rem-menu-Reports' className={`mdl-navigation__link ${css(styles.menuItems)}`} to='#'>Reports</Link>

          { (isAdmin || hasPermission(PERMISSIONS.PROJECT_MANAGE, session.permissions, projectPermissions)) &&
            <Link id='rem-navbar-mgmt' className={`mdl-navigation__link ${css(styles.menuItems)}`} to={`/projects/${projectCode}/management`} >
              Management
            </Link>
          }

          <div id='rem-menu-Projects' className={`mdl-navigation__link ${css(styles.menuItems)}`}
            onClick={() => setUi('projects.selector.display', true)}>
            Projects
          </div>
          <AvatarLogo />
        </div>
      </header>

      {
        ui['projects.selector.display'] &&
        <ProjectSelector projects={session.projects} cancelSelectProject={cancelSelectProject} selectProject={selectProject} />
      }

      <Drawer />

      <main className="mdl-layout__content">
        <Switch>
          <Route exact path='/projects/:code/dashboard' component={ProjectDashboard} />
          <Route exact path='/projects/:code/management' component={MgmtContainer} />
          <Route exact path='/projects/:code/surveys/new' component={SurveyForm} />
          <Route path='/projects/:code/surveys/:surveyId/approval' component={DataApproval} />
          <Route exact path='/projects/:code/reports/:reportCode' component={ReportsContainer} />
          <Route path='/projects/:code/:section'>
            <div>
              <div style={mapStyle} ><GeoMap /></div>
              <div style={tableStyle} ><GeoTable /></div>
              <div style={chartStyle} ><ChartContainer /></div>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
};

function clearProjectState(props) {
  props.clearUserProjects ();
  props.clearUserEventLogs ();
  props.clearUserSurveys ();
  props.clearUserOverlays ();
  props.clearUserFilters ();
  props.clearUserUsers ();
  props.clearUserGeojson ();
  props.clearUserCharts();

  props.setSession ('map.popup', undefined);
}

function loadProjectState(props, projectCode) {
  props.fetchUserEventLogs (projectCode);
  props.fetchUserSurveys (projectCode);
  props.fetchUserUsers (projectCode);
  props.fetchUserOverlays (projectCode);
  props.fetchUserFilters (projectCode);
  props.fetchUserGeojson (projectCode);
  props.fetchCharts (projectCode);
  props.fetchUserReports (projectCode);
}

function downloadChartData(prevChartData, nextChartData, projectCode, getChartData) {
  if (nextChartData === prevChartData)
    return;
  if (Object.values(nextChartData).length === 0)
    return;

  const chartData = Object.values(nextChartData);
  if (chartData[0].data !== undefined)
    return;

  chartData.forEach(chart => getChartData (projectCode, chart.id));
}

export default compose (

  connect(
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withRouter,

  withHandlers({
    cancelSelectProject: props => _ => props.setUi('projects.selector.display', false),
    selectProject: props => projectCode => {
      localStorage.setItem('projectCode', projectCode);
      props.setSession('projectCode', projectCode);
      props.setUi('projects.selector.display', false);
      props.history.push(`/projects/${projectCode}/dashboard`);
    }
  }),

  lifecycle ({
    componentDidMount () {
      clearProjectState(this.props);

      const projectCode = this.props.match.params.code;
      this.props.fetchUserProjects ();
      loadProjectState(this.props, projectCode);

      if (projectCode)
        this.props.setSession ('projectCode', projectCode);
      this.props.setSession ('map.baselayer', 'OSM');
    },
    componentWillUnmount () {
      this.props.setSession ('projectCode', undefined);
      this.props.setSession ('map.popup', undefined);
      this.props.setSession ('map.baselayer', undefined);
      this.props.setSession ('table.survey', undefined);
    },
    componentWillReceiveProps (nextProps) {
      if (nextProps.match.params.code !== this.props.match.params.code) {
        clearProjectState(nextProps);

        const projectCode = nextProps.match.params.code;
        nextProps.fetchUserProjects ();
        loadProjectState(nextProps, projectCode);

        nextProps.setSession ('projectCode', projectCode);
        nextProps.setSession ('map.baselayer', 'OSM');
        nextProps.setSession ('table.survey', undefined);
      }

      downloadChartData(this.props.charts.data, nextProps.charts.data, nextProps.match.params.code, nextProps.getChartData);

      if (nextProps.section !== this.props.session.section)
        this.props.setSession ('section', nextProps.section);

      if (nextProps.surveys.data && nextProps.surveys.data !== this.props.surveys.data) {
        const surveys = Object.values(nextProps.surveys.data).filter (s => s.baseline);
        if (surveys.length > 0) {
          if (this.props.session['table.survey'] === undefined)
            this.props.setSession ('table.survey', surveys[0].id);
          if (this.props.gis.data[surveys[0].id] === undefined)
            this.props.fetchUserSurveyGeojson (this.props.session['projectCode'], surveys[0].id);
          if (!Object.values(this.props.surveyFieldValues.data).some(fv => +fv.survey_id === +surveys[0].id))
            this.props.fetchUserSurveyFieldValues(this.props.session['projectCode'], surveys[0].id);
          }
      }
    },

    componentDidUpdate() {
      window.componentHandler.upgradeAllRegistered();
    }
  })

) (ProjectContainer);
