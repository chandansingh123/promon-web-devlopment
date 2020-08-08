import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import Table from 'components/ext/mdl/Table';
import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';
import GeojsonForm from './GeojsonForm';
import { removeProjectBaselayer } from 'actions/projectAction';
import { fetchUserProfile } from 'actions/projectUserAction';


const GeojsonMgmtTable = ({ data, projectCode, remove }) => {
  const deleteConfirmation = (id, row) => DeleteConfirmationDialog({
    onDelete: () => remove(projectCode, id),
    text: `Are you sure you want to remove the geojson layer <strong>${row.name}</strong>?`
  });

  const columns = [
    {label: 'Name',   value: 'name',   display: true},
  ];

  const actions = [
    { type: 'delete', action: deleteConfirmation, tooltip: 'Remove Layer' }
  ];

  return <Table keyField='code' data={data} columns={columns} actions={actions} />;
};


const GeojsonMgmtContainer = props => (
  <div style={{display: 'flex', flexDirection: 'row'}}>
    <div style={{width: '50%', padding: '20px 0'}}>
      <GeojsonMgmtTable {...props} />
    </div>
    <GeojsonForm />
  </div>
);


export default compose (

  connect(
    state => ({
      projectCode: state.session.projectCode,
      data: state.session.projects && state.session.projectCode && state.session.projects.find(p => p.code === state.session.projectCode).base_layers,
    }),
    dispatch => ({
      removeProjectBaselayer: (projectCode, id, callback) => dispatch(removeProjectBaselayer(projectCode, id, callback)),
      fetchUserProfile: _ => dispatch(fetchUserProfile())
    })
  ),

  withHandlers({
    remove: props => (projectCode, id) => props.removeProjectBaselayer(projectCode, id, props.fetchUserProfile)
  })

) (GeojsonMgmtContainer);
