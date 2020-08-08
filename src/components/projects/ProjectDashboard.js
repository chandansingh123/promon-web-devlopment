
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { StyleSheet, css } from 'aphrodite';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import * as actionCreators from 'actions/userActions';
import { getDate, getTime } from 'utils/Utils';
import OLWrapper from 'components/ext/openlayers';
import ErrorHandler from 'components/Common/ErrorHandler';
import { getChartOptions } from 'components/ext/highcharts/utility';
import { PERMISSIONS, hasPermission } from 'utils/permissions';

const styles = StyleSheet.create ({
  mapContainer: {
    height: '40vw', width: '60vw', maxHeight: 500, flexGrow: 10
  },
  chartContainer: {
    width: '60vw', flexGrow: 10,
    display: 'flex', flexDirection: 'row', flexWrap: 'wrap'
  },
  surveyContainer: {
    padding: '0 10px', marginLeft: 20, height: '40vw', maxHeight: 500, flexGrow: 3
  },
  userContainer: {
    padding: '0 10px', flexGrow: 3, marginLeft: 20, maxHeight: 250
  },
  eventLogWidget: {
    padding: '0 10px', flexGrow: 3, marginLeft: 20, marginBottom: 20
  },
  eventLogContainer: {
    display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '100%', borderTop: 'solid 1px rgba(0,0,0,.2)', padding: 0,
    maxHeight: 400, overflowY: 'auto'
  },
  eventLog: {
    fontSize: '11px', borderBottom: '1px solid rgba(0, 0,0, 1)', display: 'table-row'
  },
  surveyItem: {
    paddingTop: 8, cursor: 'pointer',
    ':hover': {textDecoration: 'underline'}
  },
  approvalBadge: {
    float: 'right',
    border: '1px solid rgba(0, 0, 0, .15)',
    borderRadius: 2,
    color: '#4b4f56',
    padding: '0 4px'
  }
});

const MapWidget = ({ country, baseline }) => (
  <div className={`mdl-card mdl-shadow--2dp ${css(styles.mapContainer)}`} >
    <OLWrapper id='rem-prj-dashboard-map'
        extent = {[country.min_longitude, country.min_latitude, country.max_longitude, country.max_latitude]}
        style={{height: '100%', width: '100%' }}
        baseline={baseline}
    />
  </div>
);

const SurveyWidget = ({ surveys, permissions, projectPermissions, onSurveyClick, onSurveyApprovalClick }) => (
  <div className={`mdl-card mdl-shadow--2dp ${css(styles.surveyContainer)}`} >
    <div className='mdl-card__title' style={{ margin: '0 auto'}}>
      <h2 className='mdl-card__title-text'>Surveys</h2>
    </div>
    <div className='mdl-card__supporting-text' style={{ borderTop: 'solid 1px rgba(0,0,0,.2)', width: '100%', flexGrow: 1 }}>
      {surveys.map ((survey, idx) =>
        <div key={idx} className={`${css(styles.surveyItem)}`} onClick={() => onSurveyClick(survey.id)}>
          {!!survey.unapproved && hasPermission(PERMISSIONS.SURVEY_APPROVAL, permissions, projectPermissions) &&
            <span className={`${css(styles.approvalBadge)}`} title={`${survey.unapproved} new data to be approved.`}
              onClick={(evt) => onSurveyApprovalClick(evt, survey.id)}>
              {survey.unapproved}
            </span>
          }
          {survey.name}
        </div>
      )}
    </div>
  </div>
);

const UserRoleWidget = ({ users }) => {
  const roles = {};
  users.forEach (user => {
    user.role && user.role.forEach (role => { roles[role] ? roles[role].push(user) : roles[role] = [user]})
  });

  return (
    <div className={`mdl-card mdl-shadow--2dp  ${css(styles.userContainer)}`}>
      <div className='mdl-card__title' style={{ margin: '0 auto'}} >
        <h2 className='mdl-card__title-text'>Team</h2>
      </div>
      <div className='mdl-card__supporting-text' style={{display: 'flex', justifyContent: 'space-around', width: '100%', borderTop: 'solid 1px rgba(0,0,0,.2)' }} >
        {
          Object.keys(roles).map ((role, idx) => <div key={idx} style={{textAlign: 'center', width: 100 }}>
              <div style={{fontSize: '6em', height: 100, lineHeight: 1}} >{roles[role].length}</div>
              <div style={{fontSize: '.95em'}} >{role}</div>
            </div>
          )
        }
      </div>
    </div>
  );
};

const ChartWidget = ({ charts }) => (
  <div className={`mdl-card mdl-shadow--2dp ${css(styles.chartContainer)}`}>
    { charts.map (chart =>
      <div id={`prd-chr-${chart.id}`} key={chart.id} style={{width: 300, height: 300, margin: '0 auto'}} >
        <ErrorHandler>
          <HighchartsReact highcharts={Highcharts} options={getChartOptions(chart, chart.data)} />
        </ErrorHandler>
      </div>
    )}
    <div style={{flexGrow: 1}} />
  </div>
);

const EventLogWidget = ({ events }) => {
  let eventDate = '';

  return (
    <div className={`mdl-card mdl-shadow--2dp ${css(styles.eventLogWidget)}`}>
      <div className='mdl-card__title' style={{ margin: '0 auto'}} >
        <h2 className='mdl-card__title-text'>Event Log</h2>
      </div>
      <div className={`mdl-card__supporting-text ${css(styles.eventLogContainer)}`} >
      {
        events.map ((event, index) => (
          <div key={index}>
            {event.date !== eventDate && <div style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}>{eventDate = event.date}</div>}

            <div className={`${css(styles.eventLog)}`}>
              <div style={{display: 'table-cell', paddingRight: 5}}>{ event.time }</div>
              <div style={{display: 'table-cell'}}>{ event.text }</div>
            </div>
          </div>
        ))
      }
      </div>
    </div>
  );
}

const ProjectDashboard = ({ session, projectCode, surveys, users, charts, events, gis, onSurveyClick, onSurveyApprovalClick }) => (
  <div style={{padding: '20px 50px'}} >
    <div style={{display: 'flex', margin: '20px 0'}} >
      <ErrorHandler>
        <MapWidget country={session.country || {}} baseline={gis.data.baseline} />
      </ErrorHandler>
      <SurveyWidget surveys={Object.values (surveys.data).sort ((s1, s2) => (s1.id > s2.id))}
          permissions={session.permissions} projectPermissions={session.projects.find(p => p.code === projectCode).permissions}
          onSurveyClick={onSurveyClick} onSurveyApprovalClick={onSurveyApprovalClick} />
    </div>
    <div style={{display: 'flex', margin: '20px 0'}} >
      <ChartWidget charts={Object.values (charts.data).filter (c => c.in_dashboard)} />
    </div>
  </div>
);


export default compose (

  connect (
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withProps (props => ({
    events: Object.values (props.eventlogs.data)
      .sort ((e1, e2) => e2.datetime - e1.datetime)
      .map (e => ({...e, date: getDate (e.datetime * 1000), time: getTime (e.datetime * 1000)})),
    projectCode: props.match.params.code
  })),

  withHandlers ({
    onSurveyClick: props => surveyId => {
      props.setSession ('table.survey', surveyId);
      props.history.push (`/projects/${props.session.projectCode}/table`);
      if (props.gis.data[surveyId] === undefined)
        props.fetchUserSurveyGeojson (props.session['projectCode'], surveyId);
      if (!Object.values(props.surveyFieldValues.data).some(fv => fv.survey_id === surveyId))
        props.fetchUserSurveyFieldValues(props.session['projectCode'], surveyId);
    },
    onSurveyApprovalClick: props => (evt, surveyId) => {
      evt.stopPropagation();
      props.history.push (`/projects/${props.session.projectCode}/surveys/${surveyId}/approval`);
    }
  }),

  withRouter
) (ProjectDashboard);
