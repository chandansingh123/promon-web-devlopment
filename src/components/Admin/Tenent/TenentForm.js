import React from 'react';

import InputField from 'components/Admin/Common/InputField';
import DialogForm from 'components/Admin/Common/DialogForm';

const styles = {
  legend: {
    marginBottom: 20,
    fontSize: 14,
    letterSpacing: 1
  },
  fieldset: {
    width: '45%'
  },
  fieldsetContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 4
  },
  nameInput: {
    width: '30%'
  }
};

class TenentForm extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.newTenent !== this.props.newTenent;
  }

  render () {
    const props = this.props;
    const formTitle = props.editMode ? 'Edit' : 'Add';
    const errors = props.newTenent.errors || {};

    return (
      <DialogForm id='rem-tnt-frm' title={`${formTitle} Country`} mode={props.editMode ? 'edit' : 'add'}
          onCancel={props.handleCancleClick} onAdd={props.handleSaveClick} onUpdate={props.handleUpdateClick}
          show={props.newTenent.editing} style={{minWidth: 600}} errors={props.newTenent.errors} >

        <div style={styles.fieldsetContainer}>
          <InputField id='rem-tnt-frm-name' required label='Name' type='name' field='name' value={props.newTenent.name} onChange={props.onChange}
              style={styles.fieldset} errorMsg={errors['name'] || 'Country name is required.'}/>
          <InputField id='rem-tnt-frm-code' required pattern='[a-z]{2}' label='Country Code (ISO 2-Letter)' type='code' disabled={props.editMode} field='code'
            value={props.newTenent.code} onChange={props.onChange}  style={styles.fieldset}
            errorMsg={errors['code'] || 'Country code must be 2 characters and lower-case.'} />
        </div>

        <div style={styles.fieldsetContainer}>
          <fieldset style={styles.fieldset} >
            <legend style={styles.legend}>Top Left</legend>
            <InputField id='rem-tnt-frm-min-longitude' label='Longitude' type='number' step={0.0001} field='min_longitude'
                min={-180} max={180} value={props.newTenent.min_longitude} onChange={props.onChange}/>
            <InputField id='rem-tnt-frm-min-latitude' label='Latitude' type='number' step={0.0001} field='min_latitude'
                min={-90} max={90} value={props.newTenent.min_latitude} onChange={props.onChange} />
          </fieldset>

          <fieldset style={styles.fieldset} >
            <legend style={styles.legend}>Bottom Right</legend>
            <InputField id='rem-tnt-frm-max-longitude' label='Longititude' type='number' step={0.0001} field='max_longitude'
                min={-180} max={180} value={props.newTenent.max_longitude} onChange={props.onChange} />
            <InputField id='rem-tnt-frm-max-latitude' label='Latitude' type='number' step={0.0001} field='max_latitude'
                min={-90} max={90} value={props.newTenent.max_latitude} onChange={props.onChange} />
          </fieldset>
        </div>

        {!this.props.editMode &&
          <fieldset>
            <legend style={styles.legend}>Country Administrator</legend>
            <div style={styles.fieldsetContainer}>
              <InputField id='rem-tnt-frm-first_name' required label='First Name' type='text' field='first_name' value={props.newTenent.first_name}
                  onChange={props.onChange} style={styles.nameInput}
                  errorMsg={errors['first_name'] || 'First name is required.'} />
              <InputField id='rem-tnt-frm-middle_name'label='Middle Name' type='text' field='middle_name' value={props.newTenent.middle_name}
                  onChange={props.onChange} style={styles.nameInput} />
              <InputField id='rem-tnt-frm-last_name' required label='Last Name' type='text' field='last_name' value={props.newTenent.last_name}
                  onChange={props.onChange} style={styles.nameInput}
                  errorMsg={errors['last_name'] || 'Last name is required.'} />
            </div>
            <InputField id='rem-tnt-frm-email' required label='Email' type='email' field='email' value={props.newTenent.email}
                onChange={props.onChange}
                errorMsg={errors['email'] || 'Email address is required.'} />
          </fieldset>
        }
      </DialogForm>
    );
  }
};

export default TenentForm;
