
import React from 'react';
import { css } from 'aphrodite';
import dialogPolyfill from 'dialog-polyfill';

import Table from 'components/Admin/Common/Table';
import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import styles from 'components/Admin/Common/styles';

import TenentForm from './TenentForm';

class Tenent extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.tenant !== this.props.tenant && !this.props.isFetching;
  }

  handleDeleteClick(tenantId){
    let dialog = document.getElementById('pm-tenant-delete');
    document.getElementsByTagName("BODY")[0].appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    dialog.querySelector('#success').onclick = function(event) {
      event.preventDefault();
      this.props.deleteTenant(tenantId);
      dialog.close();
    }.bind(this);

    dialog.querySelector('#cancel').onclick =  function() {
      dialog.close();
    };
    dialog.showModal();
  }

  render () {
    const cols = [
      {label: 'Name', field: 'name', width: 2},
      {label: 'Top Left', field: 'topLeft', width: 2, optional: true},
      {label: 'Bottom Right', field: 'bottomRight', width: 2, optional: true},
      {label: 'System Administrators', field: 'admins', width: 5}
    ];
    const actions = [
      { type: 'edit',   action: this.props.editTenentStart, tooltip: 'Edit Country Information' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Country', disable: (_, data) => !data.can_delete }
    ];

    return (
      <div id='rem-tnt-container' className={`${css(styles.mainContent)}`}>
        <HeaderWithAddButton id='rem-tnt-header' headerText='Country List' handleAddClick={this.props.addTenantStart} />

        <Table id='rem-tnt-tbl' cols={cols} actions={actions} data={Object.values(this.props.tenant.data)} />

        <TenentForm editMode={this.props.tenant.editMode} newTenent={this.props.tenant.newData}
          onChange={this.props.tenentFormFieldChange} handleUpdateClick={() => this.props.updateTenent(this.props.tenant.newData)}
          handleSaveClick={() => this.props.saveTenant(this.props.tenant.newData)} handleCancleClick={this.props.tenantEditCancel}/>

        <ConfirmationPopUp id="pm-tenant-delete" title="Confirm"
          message="Are you certain that you want to delete this Country."
          subMessage=" You can't undo this action."
          successButtonText="Yes" cancelButtonText="No"/>
      </div>
    )
  }
}

export default Tenent;
