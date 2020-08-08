import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SurveyMgmtTable from './SurveyMgmtTable';
import SurveyForm from './SurveyForm';


const SurveyMgmtContainer = ({ mode }) => (
  <Fragment>
    { mode === 'edit' ? <SurveyForm /> : <SurveyMgmtTable /> }
  </Fragment>
);


export default compose (

  connect(
    state => ({
      mode: state.fullSurvey.newData && state.fullSurvey.newData.editing ? 'edit' : 'display'
    }),
    null
  ),

) (SurveyMgmtContainer);
