import React from 'react';

import Survey from '../Survey';
import Overlay from '../Overlay';
import Filter from '../Filter';
import ProjectUser from '../User/ProjectUser';
import PopupDesigner from './PopupDesigner';


class ProjectInfo extends React.Component {

  componentWillMount () {
    const currentProjectCode = this.props.match.params.projectCode;
    this.props.setSession ('projectCode', currentProjectCode);
    this.props.fetchAllSurveys(currentProjectCode, false);
    this.props.fetchOverlays(currentProjectCode);
    this.props.fetchFilters(currentProjectCode);
    this.props.fetchPopups (currentProjectCode);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.projects !== this.props.projects ||
      nextProps.surveys !== this.props.surveys ||
      nextProps.overlays !== this.props.overlays ||
      nextProps.filters !== this.props.filters ||
      nextProps.popup !== this.props.popup ||
      nextProps.users !== this.props.users
    );
  }

   componentWillUnmount () {
    this.props.setSession ('projectCode', '');
    this.props.emptyDataFilter ();
    this.props.emptyDataOverlay ();
    this.props.emptyDataPopup ();
    this.props.emptyDataSurvey ();
   }

  render () {
    const currentProjectCode = this.props.match.params.projectCode;
    const currentProject = Object.values(this.props.projects.data).filter (p => p.code === currentProjectCode)[0];

    if (this.props.projects.isFetching) {
      return <div className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>;
    }

    return (
      <div className='pm-project-info-container mdl-grid'>
        <h4 className="mdl-cell mdl-cell--12-col">Project: {currentProject.name}</h4>

        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar">
            { currentProject.project_map && <a id='rem-prj-tab-overlays' href="#overlays-panel" className="mdl-tabs__tab">Overlays/Filters</a> }
            { currentProject.project_map && <a id='rem-prj-tab-popup' href="#popup-panel" className="mdl-tabs__tab">Map Popup</a> }
          </div>

          <div className="mdl-tabs__panel" id="overlays-panel">
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--6-col">
                { currentProject.project_map && <Overlay {...this.props}/> }
              </div>
              <div className="mdl-cell mdl-cell--6-col">
                { currentProject.project_map && <Filter {...this.props}/> }
              </div>
            </div>
          </div>

          <div className="mdl-tabs__panel" id="popup-panel">
            { currentProject.project_map && <PopupDesigner {...this.props}/> }
          </div>

        </div>
      </div>
    );
  }
}

export default ProjectInfo;
