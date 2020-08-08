
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import SurveyDetail from 'components/Admin/OmkSurvey/SurveyDetail';
import * as omkDataActionCreators from 'actions/omkDataAction';
import * as omkFieldValueActionCreators from 'actions/omkFieldValueAction';
import * as omkSurveyActionCreators from 'actions/omkSurveyAction';


const DataApproval = ({ surveyId }) => {
  if (surveyId)
    return <SurveyDetail surveyId={surveyId} />;
  else
    return null;
};


export default compose (
  connect(
    state => ({...state}),
    dispatch => bindActionCreators({...omkDataActionCreators, ...omkFieldValueActionCreators, ...omkSurveyActionCreators}, dispatch)
  ),

  withRouter,

  withProps(props => {
    const projectSurveyId = +props.match.params.surveyId;
    const omkSurveyId = props.surveys.data[projectSurveyId] && props.surveys.data[projectSurveyId].omk_id;
    return {
      surveyId: omkSurveyId
    }
  })

) (DataApproval);
