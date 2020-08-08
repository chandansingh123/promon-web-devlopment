
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';

import * as actionCreators from 'actions/omkDataAction';
import config from 'config/config';


const SurveyDownload = ({surveyId, countryCode}) => (
  <div style={{padding: 20, overflowX: 'auto', fontSize: '13px'}}>
    <Link to={`${config.backend.url}/surveys/${surveyId}/data?type=csv&country=${countryCode}`} target='_blank' >Download</Link>
  </div>
);


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withRouter,

  withProps ( props => {
    return {
      surveyId: props.match.params.id,
      countryCode: props.session.country && props.session.country.code
    }
  })

) (SurveyDownload);
