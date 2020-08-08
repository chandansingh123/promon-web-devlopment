
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from 'actions/reportsAction';
import Table from 'components/Admin/Common/Table';
import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';
import ReportsForm from './ReportsForm';


const Reports = ({ data, editing, addReportsStart, editReportsStart, onDelete }) => {

  const deleteConfirmation = (id, row) => DeleteConfirmationDialog({
    type: 'report',
    name: row.name,
    onDelete: () => onDelete(id, row.code)
  });

  const cols = [
    {label: 'Name', field: 'name', maxWidth: 500, minWidth: 300, width: 5},
    {label: 'Code', field: 'code', maxWidth: 500, minWidth: 300, width: 5}
  ];
  const actions = [
    { type: 'edit',   action: editReportsStart, tooltip: 'Edit Report' },
    { type: 'delete', action: deleteConfirmation, tooltip: 'Delete Report' }
  ];

  if (editing) {
    return (
      <div className='mdl-grid' style={{padding: 0}}>
        <div className='mdl-cell--2-col' id='rem-rep-container'>
          <h4 style={{textAlign: 'center'}}>Reports</h4>
          <ul style={{listStyleType: 'none'}}>
            { data.map((r, idx) => <li key={idx}>{r.name}</li>)}
          </ul>
        </div>
        <div className='mdl-cell--10-col'>
          <ReportsForm />
        </div>
      </div>
    )
  } else {
    return (
      <div className='mdl-cell--10-col mdl-cell--1-offset' id='rem-rep-container'>
        <HeaderWithAddButton headerText='Reports' id='rem-rep-header' handleAddClick={addReportsStart} />
        <Table cols={cols} data={data} id='rem-rep-tbl' actions={actions} />
      </div>
    );
  }
}


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withProps (props => ({
    data: Object.values(props.reports.data),
    editing: props.reports.newData.editing,
    onDelete: props.deleteReports
  })),

  lifecycle({
    componentDidMount() {
      this.props.fetchReports();
    }
  })

) (Reports);
