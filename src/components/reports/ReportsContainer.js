import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import ReportsTable from './ReportsTable';
import ReportsForm from './ReportsForm';
import ITTConfig from './ITTConfig';
import ITTForm from './ITTForm';
import ITTDataTable from './ITTDataTable';


const ReportsContainer = ({ reportCode, editingMode, configMode }) => {
  if (reportCode === 'itt') {
    if (configMode) return <ITTConfig />;
    if (editingMode) return <ITTForm />;
    return <ITTDataTable />;
  } else {
    if (editingMode) return <ReportsForm reportCode={reportCode} />;
    return <ReportsTable reportCode={reportCode} />;
  }
};


export default compose(
  connect (
    state => ({
      editingMode: state.reportsData.newData && state.reportsData.newData.editing,
      configMode: state.session['itt.config']
    })
  ),

  withProps(props => ({
    reportCode: props.match.params.reportCode,
  }))

) (ReportsContainer);
