import React from 'react';
import { compose } from 'redux';
import { withProps } from 'recompose';
import { connect } from 'react-redux';

import ChartShowCase from './ChartShowCase';
import ChartForm from './ChartForm';


const ChartContainer = ({ editMode }) => (editMode ? <ChartForm /> : <ChartShowCase />);

export default compose(
  connect (
    state => ({...state}),
    _ => ({})
  ),

  withProps(props => ({
    editMode: props.charts.newData && props.charts.newData.editing
  }))

) (ChartContainer);
