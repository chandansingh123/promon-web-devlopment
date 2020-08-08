
import React from 'react';

import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import SelectFn from 'components/Common/SelectFn';
import Table from 'components/Admin/Common/Table';
import DeleteConfirmation from 'components/Common/DeleteConfirmation';


const columnTypes = [
  {'id': 'header', label: 'Header'},
  {'id': 'one', label: 'Left Column'},
  {'id': 'two', label: 'Right Column'},
  {'id': 'image', label: 'Image'}
];



const PopupForm = (props) => {
  const title = props.data.id ? 'Edit Popup Field' : 'Add Popup Field';

  const options = props.data.survey && props.surveys[+props.data.survey].fields.filter (psf => psf.psf_id);

  return (
    <DialogForm id='rem-prp-frm' title={title} mode={props.data.id ? 'edit' : 'add'}
        onCancel={props.onCancel}
        onAdd={() => props.onSave (props.projectCode, props.data)}
        onUpdate={() => props.onSave (props.projectCode, props.data)}
        show={props.data.editing} style={{minWidth: 400}}>

      <SelectFn id='rem-prp-frm-type' label='Position/Type' options={columnTypes} field='type'
        keyFn={(opt => opt.id)} valueFn={(opt => opt.label)} value={props.data.type} onChange={props.onChange}
        required errorMsg='Position/Type is required.' />
      <SelectFn id='rem-prp-frm-survey' label='Survey' options={Object.values (props.surveys)} field='survey'
        keyFn={(opt => opt.id)} valueFn={(opt => opt.name)} value={props.data.survey}
        onChange={props.onChange}
        required errorMsg='Survey is required.' />
      <SelectFn id='rem-prp-frm-field' label='Survey Field' options={options} field='surveyfield'
        keyFn={(opt => opt.psf_id)} valueFn={(opt => opt.label)} value={props.data.surveyfield}
        onChange={(field, value) => props.onChange(field, value, +props.data.survey, props.surveys)}
        required errorMsg='Survey Field is required.' />
      <InputField id='rem-prp-frm-label' label='Label/Caption' type='text' field='label' value={props.data.label} onChange={props.onChange}
      required errorMsg='Label (caption) is required.' />

    </DialogForm>
)};

function headerLabel (code) {
  switch (code) {
    case 'one': return 'Left Column';
    case 'two': return 'Right Column';
    case 'header': return 'Header';
    case 'image': return 'Image';
    default: return '';
  }
}

function surveyFieldLabel (surveys, surveyId, fieldId) {
  if (surveys.data && surveys.data[+surveyId]) {
    const psf = surveys.data[+surveyId].fields.filter (psf => psf.psf_id === +fieldId);
    if (psf.length > 0)
      return psf[0].label;
  }
}

class PopupDesigner extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      deleting: false,
      deletingId: undefined
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.popup !== this.props.popup
      || nextProps.surveys.data !== this.props.surveys.data
      || nextState !== this.state;
  }

  onDelete (id) {
    this.setState ({deleting: true, deletingId: id});
  }

  cancelDelete () {
    this.setState ({deleting: false});
  }

  submitDelete () {
    this.setState ({deleting: false});
    this.props.deletePopup (this.props.session.projectCode, this.state.deletingId);
  }

  render () {
    const cols = [
      {label: 'Position',     field: 'position',    width: 1},
      {label: 'Survey',       field: 'survey',      width: 1, optional: true},
      {label: 'Survey Field', field: 'surveyField', width: 1, optional: true},
      {label: 'Label',        field: 'label',       width: 1}
    ];
    const actions = [
      { type: 'edit',   action: this.props.editStartPopup, tooltip: 'Edit Popup Field' },
      { type: 'delete', action: this.onDelete.bind(this), tooltip: 'Delete Popup Field' }
    ];

    if (!this.props.popup)
      return null;

    const data = Object.values (this.props.popup.data);
    const headers = data.filter (d => d.type === 'header');
    const header = headers && headers[0];
    const fields = data.filter (d => d.type === 'one' || d.type === 'two');
    const images = data.filter (d => d.type === 'image');

    const sortedData = fields;
    if (header)
      sortedData.unshift (header);
    sortedData.push (...images);

    let tableData = [];
    tableData = sortedData.map (d => ({
      id: d.id,
      position: headerLabel (d.type),
      label: d.label,
      survey: this.props.surveys.data && this.props.surveys.data[+d.survey] && this.props.surveys.data[+d.survey].name,
      surveyField: surveyFieldLabel (this.props.surveys, d.survey, d.surveyfield)
    }));

    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--10-col mdl-cell--1-offset">
          <HeaderWithAddButton id='rem-prp' headerText='Map Popup Designer' handleAddClick={() => this.props.addStartPopup(this.props.session.projectCode)}/>
          <Table id='rem-prp-tbl' cols={cols} actions={actions} data={tableData} />
        </div>

        <PopupForm data={this.props.popup.newData} surveys={this.props.surveys.data} projectCode={this.props.session.projectCode}
          onChange={this.props.formFieldChangePopup}
          onCancel={this.props.addEditCancelPopup}
          onSave={this.props.popup.newData.id ? this.props.editFinishPopup : this.props.addFinishPopup} />

        <DeleteConfirmation id='rem-prp-delete' module='Popup field' deleting={this.state.deleting}
            cancel={this.cancelDelete.bind(this)} submit={this.submitDelete.bind(this)} />
      </div>
    )
  }
}

export default PopupDesigner;
