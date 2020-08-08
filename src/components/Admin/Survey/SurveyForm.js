import React from 'react';

import Stepper from 'components/Common/Stepper';
import Cancel from 'components/Admin/Common/CancelButton';

import InputField from 'components/Admin/Common/InputField';
import Select from 'components/Admin/Common/Select';
import SelectFn from 'components/Common/SelectFn';
import MultiSelect from 'components/Admin/Common/MultiSelect';
import Switch from 'components/Admin/Common/Switch';
import ColoredButtons from 'components/Admin/Common/ColoredButton';
import Dialog from 'components/Admin/Common/Dialog';
import EditableTable from 'components/Common/EditableTable';
import RemoveButton from 'components/Common/RemoveButton';


const styles = {
  input: {
    marginLeft: 20
  },
  select: {
    margin: '-5px 0 -5px 20px'
  },
  switch: {
    marginLeft: 20,
    padding: 0
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 25
  },
  filterContainer: {
    marginLeft: 20,
    paddingTop: 6,
    height: 168,
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative'
  },
  joinContainer: {
    paddingTop: 14,
    overflowX: 'hidden',
    overflowY: 'auto',
    height: 264,
    paddingLeft: 20
  },
  joinButton: {
    marginLeft: 20
  }
};

const SurveyFilter = ({index, id, ...props}) => (
  <div style={{width:'100%', display: 'flex'}} >

    <SelectFn id={`${id}-${index}-field`} field='field' label="Filter By" value={props.data.filter[index].field}
      options={props.data.fields} keyFn={(x => x.value)} valueFn={x => x.label}
      onChange={(field, value) => props.onChange('filter', index, field, value, {data: props.data}) } />

    <SelectFn id={`${id}-${index}-value`} field='value' label="Value" value={props.data.filter[index].value}
      options={props.data.filter[index].values} keyFn={(x => x.label)} valueFn={x => x.label}
      onChange={(field, value) => props.onChange('filter', index, field, value) } style={{marginLeft: 10}} />

    <RemoveButton id={`${id}-${index}-remove`} onClick={() => props.handleRemove(index)} />
  </div>
);


const SurveyInfoForm = (props) => {
  const disableBaseline = props.baselineId ? props.data.id !== props.baselineId : false;
  return (
    <form>
      <InputField id='rem-srv-frm-name' disabled={false} value={props.data.name} label="Name" onChange={props.onChange} field="name" style={styles.input}
          required errorMsg='Survey name is required.' />
      <Switch id='rem-srv-frm-baseline' disabled={disableBaseline} field='baseline' checked={props.data.baseline} onChange={props.formSwitchToggle}
          label={props.data.baseline ? 'Baseline' : 'Not Baseline'} style={styles.switch} />
      <Select id='rem-srv-frm-omk' field='omk_survey' label='Select OMK Survey' options={props.omkSurveyOpts} value={props.data.omk_survey}
          onChange={props.handleOMKSurveyChange} style={styles.select}
          required errorMsg='Survey requires a primary OMK survey.'/>

      <div className='clearfix' style={{position: 'relative'}} >
        <div style={styles.filterContainer} >
        { props.data.filter &&
          props.data.filter.map ((filter, index) =>
            <SurveyFilter id={`rem-srv-frm-filter-${index}`} key={index} index={index} data={props.data} filter={filter} onChange={props.onIndexedChangeSurvey}
              handleRemove={() => props.removeFilter(index)} />)}
        </div>
        <ColoredButtons id='rem-srv-frm-filter-add' style={styles.button} onClick={props.handleAddSurveyFilter} label="Add Filter"/>
      </div>
    </form>
  );
}


const columns = [
  {
    label: 'Group',
    field: 'group',
    editable: false,
    type:'string',
    width: 140
  },
  {
    label:'Label',
    field: 'label',
    editable: true,
    type: 'string',
    width: 200
  },
  {
    label:'Value',
    field: 'value',
    editable: false,
    type: 'string',
    width: 190
  },
  {
    label:'Display',
    field: 'display',
    editable: true,
    type: 'boolean',
    width: 60
  },
  {
    label:'Display on Load',
    field: 'defaultDisplay',
    editable: true,
    type: 'boolean',
    width: 70
  }
];

const SurveyFieldForm = (props) => (
  <div>
    { props.data.omk_survey &&
      <EditableTable id='rem-srv-frm' columns={columns} datas={props.data.fields.filter (f => (f.omk_survey === undefined || f.omk_survey === props.data.omk_survey))} inDialog={true}
        onChange={(field, index, value) => props.onChange('fields', index, field, value)}
        onClick={props.onClick} useId={false} />
    }
  </div>
);


const SurveyJoin = ({index, id, ...props}) => {
  const omkSurveys = Object.values (props.omkSurveys);
  let options = [];
  if (props.data.join[index].tableR)
    options = props.omkSurveys[+props.data.join[index].tableR].fields.reduce ((acc, cv) => Object.assign (acc, {[cv.value]: cv.label}) , {});

  return (
    <div style={{display: 'flex'}} >
      <div style={{flex: '1 1 0'}}>
        <SelectFn id={`${id}-tableL`} field='tableL' label="Survey" value={props.data.join[index].tableL} width='100%'
          options={omkSurveys} keyFn={(x => x.id)} valueFn={x => x.name}
          onChange={(field, value) => props.onChange('join', index, field, value, {data: props.data}) } />
      </div>
      <div style={{flex: '1 1 0'}}>
        <SelectFn id={`${id}-fieldL`} field='fieldL' label="Field" value={props.data.join[index].fieldL} disabled={!props.data.join[index].tableL} width='100%'
          options={props.data.join[index].tableL && props.omkSurveys[+props.data.join[index].tableL].fields} keyFn={(x => x.value)} valueFn={x => x.label}
          onChange={(field, value) => props.onChange('join', index, field, value, {data: props.data}) } />
      </div>

      <div style={{flex: '1 1 0'}}>
        <SelectFn id={`${id}-tableR`} field='tableR' label="Survey" value={props.data.join[index].tableR} width='100%'
          options={omkSurveys} keyFn={(x => x.id)} valueFn={x => x.name}
          onChange={(field, value) => props.onChange('join', index, field, value, {data: props.data}) } />
      </div>
      <div style={{flex: '1 1 0'}}>
        <SelectFn id={`${id}-fieldR`} field='fieldR' label="Field" value={props.data.join[index].fieldR} disabled={!props.data.join[index].tableR} width='100%'
          options={props.data.join[index].tableR && props.omkSurveys[+props.data.join[index].tableR].fields} keyFn={(x => x.value)} valueFn={x => x.label}
          onChange={(field, value) => props.onChange('join', index, field, value, {data: props.data}) } />
      </div>

      <div style={{flex: '1 1 0', maxWidth: '18%', marginTop: -11}}>
        <MultiSelect options ={options}
                  field={index} label='Select Value'  selected={props.data.join[index].columns}
                  removeSelected={props.handleRemoveSelectedField} onChange={props.handleMultiSelectChange} />
      </div>
      <button id={`${id}-remove`} style={{ marginLeft:10}} className="mdl-button mdl-js-button mdl-button--icon"
        onClick={(event) =>{ event.preventDefault(); props.removeRow('join', index) } } >
        <i className="material-icons">clear</i>
      </button>
    </div>
  );
};

const SurveyJoinTableForm = (props) => {
  if (!props.data.omk_survey)
    return null;
  return (
    <div style={{marginTop: -11}}>
      <ColoredButtons id='rem-srv-frm-join-add' style={styles.joinButton} onClick={() => props.addRow ('join')} label="Add Join Table"/>
      <div className='clearfix' style={styles.joinContainer} >
        { props.data.join.map( (joinField, index) => <SurveyJoin id={`rem-srv-frm-join-${index}`} key={index} index={index} {...props} />) }
      </div>
    </div>
  )
};


class SurveyForm extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.surveys.newData !== nextProps.surveys.newData;
  }

  render () {
  const props = this.props;

  if (props.surveys.newData && props.surveys.newData.fields)
    props.surveys.newData.fields.forEach (field => (field.display === undefined) && (field.display = !!field.psf_id));

  const omkSurveyOpts = {};
  Object.values(props.omkSurvey.data).map( omkSurvey => omkSurveyOpts[omkSurvey.id] = omkSurvey.name);

  const cancelButton = <Cancel id='rem-srv-frm-cancel' key={1} onClick={props.handleCancelClick}/>;

  const steps = {
    1: {
      label: 'Basic Survey Info',
      step: 1,
      component: <SurveyInfoForm data={props.surveys.newData} baselineId={props.baselineId} omkSurveyOpts={omkSurveyOpts}
        onChange={props.onChange} formSwitchToggle={props.formSwitchToggle} handleOMKSurveyChange={props.handleOMKSurveyChange}
        onIndexedChangeSurvey={props.onIndexedChangeSurvey}

        handleAddSurveyFilter={props.handleAddSurveyFilter} removeFilter={props.removeFilter}
        handleFilterSurveyFieldChange={props.handleFilterSurveyFieldChange} handleFilterSurveyFieldValueChange={props.handleFilterSurveyFieldValueChange} />,
      handleNext: false,
      buttons: [cancelButton]
    },
    2: {
      label: 'Additional Tables',
      step: 2,
      component: <SurveyJoinTableForm data={props.surveys.newData} omkSurveys={props.omkSurvey.data}
        onChange={props.onIndexedChangeSurvey}
        addRow={props.addRowSurvey} removeRow={props.removeRowSurvey}
        handleMultiSelectChange={props.handleMultiSelectChange} handleRemoveSelectedField={props.handleRemoveSelectedField}

        omkSurveyOpts={omkSurveyOpts}
         />,
        handleNext: false,
        buttons: [cancelButton]
    },
    3: {
      label: 'Edit Survey Fields',
      step: 3,
      component: <SurveyFieldForm data={props.surveys.newData} omkSurvey={props.omkSurvey}
        onChange={props.onIndexedChangeSurvey} onClick={props.handleSurveyFieldClick} />,
      buttons: [cancelButton]
    }
  };

  return (
    <Dialog resetForm={props.handleCancelClick} show={props.surveys.newData.editing} style={{width: 800}} >
      <Stepper id='rem-srv-frm' reset={!props.show} finalButtonLabel='Save' steps={steps} onFinish={props.handleSaveClick}/>
    </Dialog>
  );
  }
}

export default SurveyForm;
