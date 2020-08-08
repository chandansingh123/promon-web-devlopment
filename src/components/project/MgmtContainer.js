import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserMgmtContainer from './UserMgmtContainer';
import SurveyMgmtContainer from './SurveyMgmtContainer';
import GeojsonMgmtContainer from './GeojsonMgmtContainer';


class MgmtContainer extends PureComponent {

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  render() {
    const { project, displayMode } = this.props;
    const style = displayMode ? {} : {display: 'none'};

    return (
      <div className='pm-project-info-container mdl-grid'>
        <h4 className='mdl-cell mdl-cell--12-col'>{project.name}</h4>
        <div className='mdl-cell mdl-cell--12-col'>Management Dashboard</div>

        <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect'>
          <div className='mdl-tabs__tab-bar' style={style}>
            <a id='rem-prj-tab-users' href='#rem-prj-tab-users-panel' className='mdl-tabs__tab is-active'>Users</a>
            <a id='rem-prj-tab-surveys' href='#rem-prj-tab-surveys-panel' className='mdl-tabs__tab'>Surveys</a>
            <a id='rem-prj-tab-geojsons' href='#rem-prj-tab-geojsons-panel' className='mdl-tabs__tab'>Additional Layers</a>
          </div>

          <div className='mdl-tabs__panel is-active' id='rem-prj-tab-users-panel'>
            <UserMgmtContainer />
          </div>
          <div className='mdl-tabs__panel' id='rem-prj-tab-surveys-panel'>
            <SurveyMgmtContainer />
          </div>
          <div className='mdl-tabs__panel' id='rem-prj-tab-geojsons-panel'>
            <GeojsonMgmtContainer />
          </div>

        </div>

      </div>
    );

  }
}

export default compose (

  connect(
    state => ({
      project: Object.values(state.session.projects).find(p => p.code === state.session.projectCode),
      displayMode: !state.projectUsers.newData.editing && !state.fullSurvey.newData.editing
    })
  ),

) (MgmtContainer);
