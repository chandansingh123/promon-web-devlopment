import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/reportsAction';
import CheckBox from 'components/ext/mdl/CheckBox';

const ProjectReports = ({reports, projectId, onClick}) => (
  <div>
    <h4>Used Reports</h4>
    {reports.map((r, idx) =>
      <CheckBox key={idx} id={`rem-prj-rep-${r.code}`} label={r.name} checked={r.projects.includes(projectId)}
          onClick={onClick} />
    )}
  </div>
);

export default compose(
  withRouter,

  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  lifecycle({
    componentDidMount() {
      this.props.fetchReports();
    }
  }),

  withProps(props => ({
    reports: Object.values(props.reports.data),
    projectId: Object.values(props.projects.data).find(p => p.code === props.match.params.projectCode).id
  })),

  withHandlers({
    onClick: props => (field, data) => {
      console.log(data);
    }
  })
) (ProjectReports);
