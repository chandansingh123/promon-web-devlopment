
import React from 'react';
import { compose } from 'redux';
import { withProps } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/chartAction';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';
import pieChartIcon from 'images/pie-chart.svg';
import lineChartIcon from 'images/line-chart.svg';
import columnChartIcon from 'images/column-chart.svg';
import barChartIcon from 'images/bar-chart.svg';


const ChartTypeButton = ({style, value, onClick}) => (
  <input type="button" style={style} className="pm-add-chart-button" onClick={() => onClick ('type', value)}/>
);

const ChartBasicInformationForm = (props) => {
    const pieChartStyle={
        backgroundImage: `url("${pieChartIcon}")`,
        boxShadow: props.data.type === 'pie' ? '2px 7px 6px #888888': ''
    }
    
    const lineChartStyle={
        backgroundImage: `url("${lineChartIcon}")`,
        boxShadow: props.data.type === 'line' ? '2px 7px 6px #888888': ''
    }
    
    const columnChartStyle={
        backgroundImage: `url("${columnChartIcon}")`,
        boxShadow: props.data.type === 'column' ? '2px 7px 6px #888888': ''
    }
    
    const barChartStyle={
        backgroundImage: `url("${barChartIcon}")`,
        boxShadow: props.data.type === 'bar' ? '2px 7px 6px #888888': ''
    }

  return (
    <div className="mdl-card__supporting-text">
      <form id='rem-chr-frm-2'>
        <InputField id='rem-chr-frm-title' disabled={false} value={props.data.title} label="Title" onChange={props.onChange} field="title"
          required errorMsg='Chart title is mandatory.'/>
        <InputField id='rem-chr-frm-subTitle' disabled={false} value={props.data.subTitle} label="Subtitle" onChange={props.onChange} field="subTitle" />
        <div>
          <ChartTypeButton style={pieChartStyle} value='pie' onClick={props.onChange} />
          <ChartTypeButton style={barChartStyle} value='bar' onClick={props.onChange} />
          <ChartTypeButton style={columnChartStyle} value='column' onClick={props.onChange} />
          <ChartTypeButton style={lineChartStyle} value='line' onClick={props.onChange} />
        </div>
        <div style={{display: 'flex'}}>
          <div className="mdl-textfield mdl-js-textfield" style={{display: 'block', width: 150}} >
            <label style={{fontSize: 12, fontWeight: 'unset'}}>Width</label>
            <input id='rem-chr-frm-width' className="mdl-slider mdl-js-slider" type="range" min="1" value={props.data.width}
              max="10" tabIndex="0" step="1" onChange={(event) => props.onChange('width', event.target.value)}/>
          </div>
          <div className="mdl-textfield mdl-js-textfield" style={{display: 'block', width: 150}} >
            <label style={{fontSize: 12, fontWeight: 'unset'}}>Height</label>
            <input id='rem-chr-frm-height' className="mdl-slider mdl-js-slider" type="range" min="1" value={props.data.height}
              max="10" tabIndex="0" step="1" onChange={(event) => props.onChange('height', event.target.value)}/>
          </div>
        </div>
        <Switch id='rem-chr-frm-in_dashboard' checked={props.data.in_dashboard} field='in_dashboard' onChange={props.formSwitchToggleChart}
            label='Display on Dashboard' />
      </form>
    </div>
  )
}

export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withProps ( props => {
    return {
      data: props.charts.newData,
      onChange: props.formFieldChangeChart,
      formSwitchToggleChart: props.formSwitchToggleChart
    }
  }),

) (ChartBasicInformationForm);
