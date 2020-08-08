
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as reportsActionCreators from 'actions/reportsAction';
import * as reportsDataActionCreators from 'actions/reportsDataAction';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import Table from 'components/ext/mdl/Table';


const ReportsTable = ({ report, projectCode, data, addReportsDataStart, editReportsDataStart }) => {
  if (!report || !report.fields)
    return null;
  
   const columns = report.fields.map(f => ({
      label: f.label,
      value: f.value,
      type: f.type,
      values: f.values.map(v => v.value),
      display: true,
      width: f.type === 'int' || f.type === 'decimal' ? '40' : '200'
    }));

  columns.filter(f => f.type === 'select' || f.type === 'select1').forEach(f => {
    if (f.values) {
      data.forEach(d => {
        const dataValue = d[f.value];
        const correctValue = f.values.find(f1 => f1.value === dataValue);
        d[f.value] = correctValue ? correctValue.label : d[f.value];
      });
    }
  });

  const actions = [
    { type: 'edit', action: editReportsDataStart, tooltip: 'Edit record' },
  ];

  return (
    <div style={{padding: '0 20px'}}>
      <ColoredButton icon='add' label='Add' style={{float: 'right'}} onClick={() => addReportsDataStart(report.urlcode, projectCode)} />
      <h4 style={{paddingLeft: 20}}>{report.name}</h4>
      <Table keyField='id' data={data} columns={columns} actions={actions} />
    </div>
  );
}


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...reportsActionCreators, ...reportsDataActionCreators} , dispatch)
  ),

  withProps(props => ({
    report: Object.values(props.reports.data).find(r => r.urlcode === props.reportCode),
    projectCode: props.session.projectCode,
    data: Object.values(props.reportsData.data)
  })),

  lifecycle({
    componentDidMount() {
      const reportCode = this.props.reportCode;
      const projectCode = this.props.session.projectCode;
      this.props.fetchSingleReports(reportCode);
      this.props.fetchReportsData(reportCode, projectCode);
    },
    componentDidUpdate(prevProps) {
      if (prevProps.reportCode !== this.props.reportCode) {
        const reportCode = this.props.reportCode;
        const projectCode = this.props.session.projectCode;
        this.props.clearReportsData();
        this.props.fetchSingleReports(reportCode);
        this.props.fetchReportsData(reportCode, projectCode);
      }
    }
  })
) (ReportsTable);
