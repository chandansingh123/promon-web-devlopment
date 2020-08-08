import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActionCreator from 'actions/filterAction';
import * as userActionCreators from 'actions/userActions';
import MultiSelect from 'components/Admin/Common/MultiSelect';
import Accordian from './Accordian';
import icon from 'images/filter.png';
import MiniFab from 'components/Common/MiniFab';
import FilterForm from './OverlayFilterForm';


export const FILTERS_ACTIVE = 'map.filters';


const styles = {
  text: {
    position: 'relative',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 210
  },
  form: {
    border: 'solid 1px rgba(0, 0, 0,0.3)',
    margin: 5,
    padding: '10px 5px'
  }
};


const Filter = ({ filters, ui, selectedFilters,
    setUi, addFilterInMap, removeFilterFromMap, addFilterStart }) => (
  <Accordian header='Filters' icon={icon} section='filter' setUi={setUi} ui={ui}
    body={
      <div style={{position: 'relative', paddingBottom: 36}}>
        {Object.values(filters) &&
          Object.values(filters).map (data =>
            <MultiSelect key={data.id} options={data.values.reduce((acc, cv) => Object.assign(acc, {[cv.label]: cv.label}), {})}
              field={data.id} label={data.alias} id={data.id} textStyle={styles.text}
              onChange={(filterId, filterValue) => addFilterInMap(filterId, filterValue)}
              removeSelected={(filterId, filterValue) => removeFilterFromMap(filterId, filterValue)}
              selected={selectedFilters[data.id]} />
          )
        }

        <div style={{position: 'absolute', right: 0, bottom: 0}}>
          <MiniFab icon='add' onClick={addFilterStart}/>
        </div>
        <FilterForm id='rem-filter-form' type='Filter' storeSection='filters' />

      </div>
    }
  />
);

export default compose (
  connect(
    state => ({
      filters: state.filters.data || {},
      currentFilters: state.ui[FILTERS_ACTIVE] || {},
      ui: state.ui,
      gis: state.gis,
      session: state.session,
      surveys: state.surveys.data,
      selectedFilters: state.ui[FILTERS_ACTIVE] || {}
    }),
    dispatch => bindActionCreators({...filterActionCreator, ...userActionCreators}, dispatch)
  ),

  withProps(props => ({
    onChange: props.filterFormFieldChange,
    onCancel: props.filterEditCancel
  })),

  withHandlers({
    addFilterInMap: props => (id, value) => {
      // Download survey
      const surveyId = props.filters[+id].survey;
      if (props.gis.data[surveyId] === undefined)
        props.fetchUserSurveyGeojson (props.session['projectCode'], surveyId);

      // Add filter to Redux state
      let currentFilters = props.ui[FILTERS_ACTIVE] || {};
      const fvAdded = currentFilters[id] ? [...currentFilters[id], value] : [value];
      currentFilters = {...currentFilters, [id]: fvAdded};
      props.setUi(FILTERS_ACTIVE, currentFilters);
    },

    removeFilterFromMap: props => (id, value) => {
        let currentFilters = props.ui[FILTERS_ACTIVE] || {};
        let fvRemoved = currentFilters[id].filter (fv => fv !== value);
        if (fvRemoved.length === 0)
            fvRemoved = undefined;
        currentFilters = {...currentFilters, [id]: fvRemoved};
        props.setUi(FILTERS_ACTIVE, currentFilters);
    }
  })

) (Filter);
