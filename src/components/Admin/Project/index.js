import React from 'react';
import { Switch } from 'react-router';
import { Route } from "react-router-dom";

import Project from './Project';
import ProjectInfo from './ProjectInfo';
import PageNotFound from 'components/Common/PageNotFound';

class ProjectDashboard extends React.Component {

  render () {
    return(
      <div>
        <Switch>
          <Route exact path='/admin/project/:projectCode' render = {(props) => <ProjectInfo {...this.props} match={props.match}/>} />
          <Route exact path='/admin/project' render = {(props) => <Project {...this.props} match={props.match}/>} />
          <Route component={PageNotFound}/>
        </Switch>
      </div>
    )
  }
}

export default ProjectDashboard;