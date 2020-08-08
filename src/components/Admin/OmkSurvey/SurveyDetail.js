import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ColoredButton from 'components/Admin/Common/ColoredButton';
import FlatButton from 'components/Common/FlatButton';
import PictureViewer from 'components/Common/PictureViewer';
import LocationViewer from 'components/Common/LocationViewer';
import { fetchOmkData, onIndexedChangeOmkData, acceptOmkData, clearOmkData } from 'actions/omkDataAction';
import { fetchOmkFieldValues } from 'actions/omkFieldValueAction';
import { fetchOmkSurveys } from 'actions/omkSurveyAction';
import { setUi } from 'actions/uiAction';
import OLWrapper from 'components/ext/openlayers';

const styles = {
  label: {
    display: 'inline-block',
    width: 250,
    paddingRight: 10,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
    paddingTop: 10
  },
  container: {
    maxHeight: '100vh',
    overflowY: 'hidden',
    marginTop: -44,
    display: 'flex',
    flexDirection: 'column'
  }
};

const FlatIconButton = ({ icon, onClick, disabled }) => (
  <button className="mdl-button mdl-js-button mdl-js-ripple-effect" disabled={disabled}
    onClick={(evt) => { evt.preventDefault(); onClick(); }}>
    <i className="material-icons">{icon}</i>
  </button>
);

const InputFieldX = ({ id, onChange, value, readonly, datatype }) => {
  let numberOfLines = 1;
  // TODO use seperate inputField for text area.
  if (typeof (value) === 'string') {
    numberOfLines = value.split(/\r\n|\r|\n/).length;
  }
  let props;
  let style;
  if (readonly) {
    props = { readOnly: 'readonly' }
    style = {
      fontSize: 11,
      color: 'rgba(0,0,0,.26)',
      borderBottom: '1px dotted rgba(0,0,0,.12)'
    };
  } else {
    props = { onChange: event => onChange(event.target.value) }
    style = {
      fontSize: 11
    };
  }

  switch (datatype) {
    case 'date': props = { ...props, type: 'date' }; break;
    case 'datetime': props = { ...props, type: 'datetime-local' }; break;
    case 'decimal': props = { ...props, type: 'number', step: '0.01' }; break;
    case 'int': props = { ...props, type: 'number' }; break;
  }

  return (
    <div className='mdl-textfield mdl-js-textfield rem-omk-detail' style={{ display: 'inline-block', paddingBottom: 0, paddingTop: 8 }}>
      {
        numberOfLines === 1
          ? <input className="mdl-textfield__input" type="text" id={id} style={style} value={value || ''} {...props} />
          : <textarea className="mdl-textfield__input" type="text" id={id} style={style} value={value || ''} {...props} rows={numberOfLines} />
      }
    </div>
  );
}

const SelectX = ({ id, options, keyFn, valueFn, onChange, value }) => (
  <div className="mdl-textfield mdl-js-textfield rem-omk-detail" style={{ display: 'inline-block', paddingBottom: 0, paddingTop: 8 }}>
    <select className="mdl-textfield__input" id={id} type="text" style={{ fontSize: 11 }} value={value || ''}
      onChange={event => onChange(event.target.value)} >
      <option value="" disabled />
      {options && options.map(opt => <option value={keyFn(opt)} key={keyFn(opt)}> {valueFn(opt)} </option>)}
    </select>
  </div>
);

const CheckBoxX = ({ id, label, value, onClick, checked }) => (
  <div key={id}>
    <label className='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' htmlFor={id}>
      <input type='checkbox' id={id} className='mdl-checkbox__input' onChange={evt => onClick(value, evt.target.checked)} checked={checked} />
      <div className="mdl-checkbox__label" title={label}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, display: 'inline-block', fontSize: 12 }} >
        {label}
      </div>
    </label>
  </div>
);

function handleChange(value, checked, onChanged, values) {
  if (checked)
    values.push(value);
  else
    values.splice(values.indexOf(value), 1);
  onChanged(values.join(' '));
}

const SelectMultipleX = ({ id, options, keyFn, valueFn, onChange, value }) => {
  const values = value ? value.split(' ') : [];

  return (
    <div className="mdl-textfield mdl-js-textfield rem-omk-detail" style={{ display: 'inline-block', paddingBottom: 0, paddingTop: 8 }}>
      {options && options.map(
        (opt, index) => <CheckBoxX id={`${id}-${index}`} key={index} label={valueFn(opt)} value={keyFn(opt)} checked={values.indexOf(keyFn(opt)) > -1}
          onClick={(value, checked) => handleChange(value, checked, onChange, values)} />
      )}
    </div>
  );
}


class SurveyDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    };
  }

  componentDidMount() {
    const omkSurveyId = this.props.surveyId;
    this.props.fetchOmkData(omkSurveyId);
    this.props.fetchOmkFieldValues(omkSurveyId);
    this.props.fetchOmkSurveys();
  }

  componentWillUnmount() {
    this.props.clearOmkData();
  }

  colMetaData(field, surveyValues) {
    const options = surveyValues.data[+field.id] && surveyValues.data[+field.id].values;
    return {
      label: field.label,
      field: '_' + field.value,
      type: options ? 'select' : (field.omk_datatype === 'image' || field.omk_datatype === 'geopoint' ? field.omk_datatype : 'string'),
      multiple: field.omk_datatype !== 'select1',
      options: options,
      keyFn: options && (data => data.value),
      valueFn: options && (data => data.label),
      meta: field.meta,
      datatype: field.datatype
    };
  }

  onPrev() {
    this.setState({ currentIndex: this.state.currentIndex - 1 });
  }

  onNext() {
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  }

  renderField(field, index, data) {
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={styles.label} title={field.label}>{field.label}</div>

        {field.type === 'string' &&
          <InputFieldX id={`rem-omk-frm-${field.field}`} value={data && data[field.field]} readonly={field.meta && !!field.meta.preloaded}
            onChange={(value) => this.props.onIndexedChangeOmkData(field.field, data && data.id, value)} datatype={field.datatype} />
        }
        {field.type === 'select' && field.multiple === false &&
          <SelectX id={`rem-omk-frm-${field.field}`} options={field.options} keyFn={field.keyFn} valueFn={field.valueFn}
            style={{ display: 'inline-block' }} value={data && data[field.field]}
            onChange={(value) => this.props.onIndexedChangeOmkData(field.field, data && data.id, value)} />
        }
        {field.type === 'select' && field.multiple === true &&
          <SelectMultipleX id={`rem-omk-frm-${field.field}`} options={field.options} keyFn={field.keyFn} valueFn={field.valueFn}
            style={{ display: 'inline-block' }} value={data && data[field.field]}
            onChange={(value) => this.props.onIndexedChangeOmkData(field.field, data && data.id, value)} />
        }
        {field.type === 'image' && data && data[field.field] &&
          <span style={{ paddingTop: 10 }}>
            {data && data[field.field][0].split('/').slice(-1)[0]}
            <FlatButton icon='photo' onClick={_ => this.props.setUi('omk.approval.image', data[field.field][0])} />
          </span>
        }
        {field.type === 'geopoint' && data && data[field.field] &&
          <div>
            <span>
              <InputFieldX id={`rem-omk-frm-${field.field}`} value={data && data[field.field]} readonly={field.meta && !!field.meta.preloaded}
                onChange={(value) => this.props.onIndexedChangeOmkData(field.field, data && data.id, value)} datatype={field.datatype} />
              <FlatButton icon='location_on' onClick={_ => this.props.setUi('omk.approval.geopoint', data[field.field])} />
            </span>
          </div>
        }
      </div>
    );
  }


  render() {
    let fields = this.props.omkSurvey.data[+this.props.surveyId] && this.props.omkSurvey.data[+this.props.surveyId].fields;
    fields = fields || [];
    const cols = fields.filter(f => !f.value.startsWith('meta_')).map(f => this.colMetaData(f, this.props.omkFieldValues));
    const splitPoint = Math.ceil(cols.length / 2);
    const leftCol = cols.slice(0, splitPoint - 1);
    const rightCol = cols.slice(splitPoint - 1);
    const data = Object.values(this.props.omkData.data).filter(d => d !== undefined) || [];

    return (
      <div className='mdl-cell--10-col mdl-cell--1-offset' style={styles.container}>

        <PictureViewer uiKey='omk.approval.image' tooltip='Survey Image' />
        <LocationViewer uiKey='omk.approval.geopoint' />

        <div style={{ height: 44, minHeight: 44 }} />
        <div style={{ padding: 10, margin: 10, height: 60, minHeight: 60 }} >
          <ColoredButton id='rem-omk-frm-add' icon='add' label='Add' style={{ position: 'absolute', right: 90 }}
            onClick={() => this.props.addRowOmkData(this.props.omkSurvey.data[+this.props.surveyId].fields)} />
        </div>

        <div>
          <span>{data.length} surveys to be approved.</span>
          {data.length > 0 && <span style={{ paddingLeft: 10, fontWeight: 'bold' }}>Survey No: {this.state.currentIndex + 1}</span>}
          <FlatIconButton icon='navigate_before' disabled={this.state.currentIndex <= 0} onClick={this.onPrev.bind(this)} />
          <FlatIconButton icon='navigate_next' disabled={this.state.currentIndex >= (data.length - 1)} onClick={this.onNext.bind(this)} />

          <div style={{ float: 'right' }}>
            <ColoredButton id={`rem-omk-frm-accept`} icon='done' style={{ margin: 4 }} tooltip='Accept' disabled={!data.length}
              onClick={() => this.props.acceptOmkData(this.props.surveyId, data[this.state.currentIndex], 'Accept')} />
            <ColoredButton id={`rem-omk-frm-reject`} icon='clear' style={{ margin: 4 }} tooltip='Reject' disabled={!data.length}
              onClick={() => this.props.acceptOmkData(this.props.surveyId, data[this.state.currentIndex], 'Reject')} />
          </div>
        </div>
        <hr />

        {
          !!data.length &&
          <div style={{ overflowY: 'auto' }}>
            <div className="mdl-grid">
              <div className='mdl-cell--6-col' style={{ fontSize: 11 }}>
                {leftCol.map((field, index) => this.renderField(field, index, data[this.state.currentIndex]))}
              </div>
              <div className='mdl-cell--6-col' style={{ fontSize: 11 }}>
                {rightCol.map((field, index) => this.renderField(field, index, data[this.state.currentIndex]))}
              </div>
            </div>
          </div>
        }

      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      omkSurvey: state.omkSurvey,
      omkData: state.omkData,
      omkFieldValues: state.omkFieldValues
    }),
    dispatch => ({
      clearOmkData: _ => dispatch(clearOmkData()),
      fetchOmkData: omkSurveyId => dispatch(fetchOmkData(omkSurveyId)),
      fetchOmkFieldValues: omkSurveyId => dispatch(fetchOmkFieldValues(omkSurveyId)),
      fetchOmkSurveys: _ => dispatch(fetchOmkSurveys()),
      onIndexedChangeOmkData: (field, index, value) => dispatch(onIndexedChangeOmkData(field, index, value)),
      acceptOmkData: (id, data, action) => dispatch(acceptOmkData(id, data, action)),
      setUi: (field, value) => dispatch(setUi(field, value))
    })
  )

)(SurveyDetail);
