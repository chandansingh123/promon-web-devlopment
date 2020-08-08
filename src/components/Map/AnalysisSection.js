
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { setUi } from 'actions/uiAction';
import { unsetAoi } from 'actions/aoiAction';
import Switch from 'components/Admin/Common/Switch';
import InputField from 'components/Admin/Common/InputField';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import icon from 'images/maplayer.svg';


export const AOI_POINT_DISTANCE = 'map.aoi.distance';
export const MAP_AOI_ANALYSIS = 'map.analysis';
export const AOI_POINT_KEY = 'map.aoi.point';
export const AOI_POLYGON_KEY = 'map.aoi.polygon';


const styles = {
  container: {
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    position: 'absolute',
    bottom: 0,
    background: 'white',
    minWidth: 300,
    top: 0
  },
  title: {
    textAlign: 'center',
    borderBottom: '1px solid rgba(0,0,0,.3)',
    paddingBottom: 10
  }
};


const AnalysisSection = ({ expanded, setUi, ui, data,
    toggleAoiPolygon, toggleAoiPoint, toggleAnalysis, openDetailPage
  }) => {
  if (expanded) {
    return (
      <div style={styles.container}>
        <div>
          <h4 style={styles.title}>Buffer Analysis</h4>
          <div style={{padding: '0 20px'}}>
            <Switch id='rem-map-aoi-point' checked={ui[AOI_POINT_KEY]} label='AOI Point'
                field='' onChange={_ => toggleAoiPoint(!ui[AOI_POINT_KEY])} />
            <Switch id='rem-map-aoi-polygon' checked={ui[AOI_POLYGON_KEY]} label='AOI Polygon'
                field='' onChange={_ => toggleAoiPolygon(!ui[AOI_POLYGON_KEY])} />
            <InputField id='rem-map-aoi-distance' label='Distance (metres)' field='' style={{marginTop: 20}} disabled={!ui[AOI_POINT_KEY]}
                value={ui[AOI_POINT_DISTANCE]} onChange={(_, value) => setUi(AOI_POINT_DISTANCE, value)} type='number' />
            <ColoredButton id='rem-map-aoi-done' tooltip='Close AOI section' label='Done'
                onClick={_ => toggleAnalysis(!expanded)}
              />
          </div>
        </div>
        { data && data.features &&
          <div style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
            <div style={{paddingLeft: 20, paddingTop: 20, fontSize: '16px', textDecoration: 'underline'}}>
              Found {data.features.length} households.
            </div>
            <table>
              <tbody>
                {data.features.map(f =>
                  <tr key={f.properties._id}>
                    <td style={{padding: '6px 10px'}}>{f.properties._id}</td>
                    <td>
                      <div style={{color:'blue', cursor:'pointer', padding: '0 20px'}} onClick={() => openDetailPage(f.properties._id)}>
                        <i className='material-icons' style={{fontSize: '16px'}} >open_in_new</i>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  } else {
    return (
      <div style={{height: 40, width: 40, position: 'absolute', top: 14, left: 627, backgroundColor: 'white', padding: 2}}>
        <img src={icon} style={{maxHeight: 26, maxWidth: 26, margin: 5}} onClick={_ => toggleAnalysis(!expanded)}/>
      </div>
    );
  }
};


export default compose(
  connect(
    state => ({
      expanded: !!state.ui[MAP_AOI_ANALYSIS],
      ui: state.ui,
      data: state.aoi,
      session: state.session
    }),
    dispatch => ({
      setUi: (key, value) => dispatch(setUi(key, value)),
      unsetAoi: _ => dispatch(unsetAoi())
    })
  ),

  withHandlers({
    toggleAnalysis: props => flag => {
      props.setUi(MAP_AOI_ANALYSIS, flag);
      if (flag) {
        props.setUi(AOI_POINT_KEY, false);
        props.setUi(AOI_POLYGON_KEY, false);
        props.setUi(AOI_POINT_DISTANCE, 1000);
      } else {
        props.unsetAoi();
      }
    },
    toggleAoiPoint: props => flag => {
      props.setUi(AOI_POINT_KEY, flag);
      if (flag) {
        props.setUi(AOI_POLYGON_KEY, false);
        props.setUi(AOI_POINT_DISTANCE, 1000);
        document.getElementById('rem-map-aoi-distance').parentNode.MaterialTextfield.enable();
      } else {
        document.getElementById('rem-map-aoi-distance').parentNode.MaterialTextfield.disable();
      }
    },
    toggleAoiPolygon: props => flag => {
      props.setUi(AOI_POLYGON_KEY, flag);
      if (flag) {
        document.getElementById('rem-map-aoi-distance').parentNode.MaterialTextfield.disable();
        props.setUi(AOI_POINT_KEY, false);
      }
    },
    openDetailPage: props => beneficiaryId => {
      if(!beneficiaryId)
        return false;

      const url = `/${props.session.country.code}/projects/${props.session.projectCode}/households/${beneficiaryId}`;
      window.open(url, '_blank');
    }
  })

  )(AnalysisSection);
