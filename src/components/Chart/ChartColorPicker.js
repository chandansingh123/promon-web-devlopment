
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from 'actions/chartAction';
import { chartColors } from 'store/globalObject';
import InputField from 'components/Admin/Common/InputField';
import ChartPreview from './ChartPreview';

const styles = {
  text: {
    width: '40%',
    minWidth: 200,
    fontSize: 13,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
  }
};


const ChartMultiColorPicker = ({ data, index, chartSfvChange }) => (
  <div >
    <table style={{width: '100%'}}>
      <tbody>
        { data.surveyFieldValues[index].map( (surveyFieldValue, idx )=> (
          <tr key={idx} style={{marginTop: 2, marginBottom: 2, padding: 0}} >
            <td style={styles.text} title={surveyFieldValue.value} >{surveyFieldValue.value}</td>
            <td style={{marginTop: 0, marginBottom: 0, padding: 0, width: 70}}>
              <input className="pm-chart-add-default-color-picker" type="color" value={surveyFieldValue.color}
                  onChange={(event) => chartSfvChange (0, idx, 'color', event.target.value)} />
            </td>
            <td style={{padding: '5px 0'}}>
              <input className="mdl-textfield__input" value={surveyFieldValue.label} style={{fontSize: '13px'}}
                    onChange={ (event) => chartSfvChange (0, idx, 'label', event.target.value) } />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const ChartSingleColorPicker = ({ data, formFieldChangeChart, chartSfvChange }) => (
  <div  >
    <div >
      <div  style={{marginTop: 0, marginBottom: 0, padding: 0}}>
        <span className="mdl-cell mdl-cell--2-col" style={{paddingTop: 13, fontSize: '16px', color: 'rgba(0,0,0,0.54)', display: 'block'}} >Color</span>
          <div className="mdl-cell mdl-cell--6-col" style={{width: 80}}>
            <input type="color" className="pm-chart-add-default-color-picker mdl-cell mdl-cell--6-col" value={data.color}
              onChange={(event) => formFieldChangeChart('color', event.target.value)}  />
          </div>
        </div>

        <div style={{maxHeight: 240, overflowY: 'auto', position: 'relative', paddingTop: 2}}>
          { data.surveyFieldValues[0].map((sfv, index) => (
              <div className="mdl-grid mdl-cell mdl-cell--12-col" key={index} style={{padding: 0, margin: 0}}>
                  <div style={styles.text} title={sfv.value} >{sfv.value}</div>
                  <InputField value={sfv.label} field='label' style={{marginTop: -10, marginLeft: 20, paddingBottom: 5}}
                      onChange={(_, value) => chartSfvChange(0, index, 'label', value)} />
              </div>
          ))}
      </div>
    </div>
  </div>
);


const RadioButton = ({ value, checked, label }) => (
  <label className='mdl-radio mdl-js-radio mdl-js-ripple-effect' htmlFor={`option-${value}`}>
    <input type="radio" id={`option-${value}`} className="mdl-radio__button" name="options" value={value} checked={checked} />
    <span class="mdl-radio__label">{label}</span>
  </label>
);

const CustomStyler = ({ data }) => (
  <div>
    { data.type === 'pie' &&
      <div>
        <h4 style={{margin: 0, fontSize: 20}}>Additional Customization</h4>
        <div>
          <RadioButton value='regular' checked={true} label='Regular' />
          <RadioButton value='semi-circle' checked={true} label='Semi Circle' />
        </div>
      </div>
    }
  </div>
);


const ChartColorPicker = ({ data, formFieldChangeChart, chartSfvChange }) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--6-col' style={{paddingLeft: 20}}>

      { data.type === 'pie' || data.surveyFields[1].value ?
        <ChartMultiColorPicker data={data} chartSfvChange={chartSfvChange} index={data.type === 'pie' ? 0 : 1} /> :
        <ChartSingleColorPicker data={data} formFieldChangeChart={formFieldChangeChart} chartSfvChange={chartSfvChange} />
      }
    </div>
    <ChartPreview />
  </div>
);


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withProps(props => ({
    data: props.charts.newData,
    projectSurveys: Object.values(props.surveys.data),
    fields: props.charts.newData.survey ? props.surveys.data[+props.charts.newData.survey].fields : []
  })),

  lifecycle({
    componentDidMount() {
      const compareFn = ((o1, o2) => {
        if (o1.order) return o1.order < o2.order ? -1 : 1;
        if (o1.value === null) return -1;
        if (o2.value === null) return 1;
        return o1.value < o2.value ? -1 : 1;
      });
      
      let surveyFieldId = +this.props.charts.newData.surveyFields[0].id;
      if (surveyFieldId) {
        const fieldValues = Object.values(this.props.surveyFieldValues.data).filter(sfv => +sfv.field_id === surveyFieldId).sort(compareFn);
        if (this.props.charts.newData.surveyFieldValues[0].length === 0 && fieldValues) {
          const x = fieldValues.map((sfv, i) => ({color: chartColors[i % 20], value: sfv.label, label: sfv.label}));
          this.props.indexedFieldChangeChart('surveyFieldValues', 0, x);
        }
      }

      surveyFieldId = +this.props.charts.newData.surveyFields[1].id;
      if (surveyFieldId) {
        const fieldValues = Object.values(this.props.surveyFieldValues.data).filter(sfv => +sfv.field_id === surveyFieldId).sort(compareFn);
        if (this.props.charts.newData.surveyFieldValues[1].length === 0 && fieldValues) {
          const x = fieldValues.map((sfv, i) => ({color: chartColors[i % 20], value: sfv.label, label: sfv.label}));
          this.props.indexedFieldChangeChart('surveyFieldValues', 1, x);
        }
      }
    }
  })

) (ChartColorPicker);
