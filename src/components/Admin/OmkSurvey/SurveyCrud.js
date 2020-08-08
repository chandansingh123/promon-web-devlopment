
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, lifecycle, withProps, withState, withHandlers } from 'recompose';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import * as actionCreators from 'actions/omkDataAction';
import FlatButton from 'components/Common/FlatButton';
import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';

const styles = {
  container: {
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 6
  },
  column: {
    padding: 0,
    marginTop: 2
  },
  label: {
    fontSize: 12,
    overflowY: 'hidden',
    textOverflow: 'ellipsis'
  }
};

const ModalDialog = (props) => (
  <div style={styles.container}>
    <div className="mdl-grid">
      {props.cols.map( (col, index) =>
        <div key={index} className="mdl-cell mdl-cell--4-col" style={styles.column} >
          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`rem-tbl-${col.value}`} style={styles.label} >
            <input type="checkbox" id={`rem-tbl-${col.value}`} className="mdl-checkbox__input" value={col.value} checked={!props.hidden[col.value]}
                onChange={(event) => props.toggleHide(event.target.value)} />
            <span className="mdl-checkbox__label" style={styles.label} title={col.label}>{col.label}</span>
          </label>
        </div>
        )
      }
    </div>
  </div>
);

const VisibilityDialog = compose (
  lifecycle ({
    componentDidMount: () => window.componentHandler.upgradeAllRegistered(),
    componentDidUpdate: () => window.componentHandler.upgradeAllRegistered()
  })
) (ModalDialog);


const SurveyCrud = ({ headers, data, hidden, toggleHide, surveyId, modifyOmkData }) => {
  const options = {
    insertModal: (onModalClose, onSave, columns, validateState, ignoreEditable) =>
        <VisibilityDialog attr={{ onModalClose, onSave, columns, validateState, ignoreEditable }} cols={headers} toggleHide={toggleHide} hidden={hidden} />,
    insertText: 'Column visibility',
    paginationShowsTotal: (from, to, total) => <p>Showing { from } to { to } of { total } entries</p>
  };

  const headerCols = headers.map ((header, index) => (
    <TableHeaderColumn key={index} dataField={header.value} isKey={header.value === 'meta_instanceid'} width='240'
        dataSort filter={{type: 'TextFilter'}} hidden={hidden[header.value]} editable={true}>
      {header.label}
    </TableHeaderColumn>
  ));
  headerCols.unshift (<TableHeaderColumn key={-1} dataField={'xyz'} isKey={false} width='80' editable={false} dataFormat={(cell, row) => (
    <div>
      <FlatButton icon='save' style={{color: 'green'}} onClick={_ => modifyOmkData (surveyId, row, 'update')} />
      <FlatButton icon='delete_forever' style={{color: 'red'}} onClick={_ => {
          DeleteConfirmationDialog({
            onDelete: () => modifyOmkData (surveyId, row, 'delete'),
            text: 'Are you sure you want to delete the survey data?'
          });
        }
      }/>
    </div>
  )} />);

  return (
    <div style={{padding: 20, overflowX: 'auto', fontSize: '13px'}}>
      { headers.length ?
        <BootstrapTable data={data} striped hover pagination options={options} insertRow cellEdit={{mode: 'click', blurToSave: true}}>
          { headerCols }
        </BootstrapTable> :
        null
      }
    </div>
  );
}

export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withRouter,

  withProps ( props => {
    return {
      headers: props.omkSurvey.data[props.match.params.id] ? props.omkSurvey.data[props.match.params.id].fields : [],
      data: props.omkData.data[props.match.params.id] ? props.omkData.data[props.match.params.id].data : [],
      surveyId: props.match.params.id
    }
  }),

  withState ('hidden', 'toggleHide', {}),

  withHandlers ({
    toggleHide: ({ toggleHide, hidden }) => (id1) => toggleHide ({...hidden, [id1]: !hidden[id1]})
  }),

  lifecycle ({
    componentDidMount () {
      const surveyId = this.props.match.params.id;
      this.props.fetchCompleteOmkData (surveyId);
    },
    componentDidUpdate () {
      window.componentHandler.upgradeAllRegistered();
    }
  })

) (SurveyCrud);
