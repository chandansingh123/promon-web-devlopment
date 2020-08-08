import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { lifecycle, compose } from 'recompose';
import { StyleSheet, css } from 'aphrodite';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { fetchUserHouseHoldDetail } from 'actions/projectUserAction';
import { setSession } from 'actions/sessionAction';
import OLWrapper from 'components/ext/openlayers';
import { isValidDateString, relativeTime, formatDate } from '../../utils/Utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    minWidth: '100%',
    padding: 0,
    margin: 0
  },
  contentContainer: {
    backgroundColor: 'white',
    margin: 0,
    marginTop: -20,
    padding: '20px 30px',
    width: 'calc(83.33% - 20px)',
    marginLeft: 'calc(8.33% + 8px)',
    '@media (max-width: 992px)': {
      width: 'calc(100% - 20px)',
      marginLeft: 8,
    }
  },
  imageContainer: {
    float: 'right',
    maxWidth: 400,
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.3)',
    padding: 10
  },
  image: {
    padding: 5,
    display: 'inline-block',
    textAlign: 'center',
    cursor: 'pointer'
  }
});

const extractImages = (surveys) => {
  return (surveys || []).reduce((acc, survey) => {
    acc = mapImages(survey.data, acc)
    return acc;
  }, [])

  function mapImages(surveyData, previousImages) {
    // TODO ask BE dev to fix the response data as survey Data is received array inside array[[{},{}]] should be [{},{}]
    const imagesOnly = surveyData[0]
      .filter(data => data.type === 'image')
      .map(item => {
        return {
          original: item.value[0],
          thumbnail: item.value[1],
          description: item.label
        }
      });
    // incase of multiple surveys concatinate all surveys images
    return [...previousImages, ...imagesOnly]
  }
}

const HouseholdDetail = ({ match, householdDetail, setSession, session }) => {
  const images = extractImages(householdDetail.data[match.params.householdId] && householdDetail.data[match.params.householdId].surveys);
  console.log('images .length >', images.length);
  return (
    <div className={`${css(styles.container)}`} >
      <div className={`${css(styles.contentContainer)}`} >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
          <h2>{match.params.householdId}</h2>
        </div>
        {householdDetail.data[match.params.householdId] && householdDetail.data[match.params.householdId].surveys.map((survey, index) =>
          <div key={index} >
            <h3 style={{ fontSize: '30px', lineHeight: '36px' }}>{survey.name}</h3>
            {survey.data.map((multipleData, index) =>
              <div key={index} style={{ marginBottom: 12, overflow: 'hidden' }}>
                <div className={`${css(styles.imageContainer)}`}>
                  <div>
                    <ImageGallery
                      items={images}
                      showNav={true}
                      showBullets={true}
                      thumbnailPosition="bottom"
                    />
                  </div>
                  {multipleData.filter(d => d.type === 'location').map((d, index) =>
                    <div key={index} >
                      <div style={{ width: 380, height: 380, border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                        <OLWrapper id={`rem-dtl-map-${survey.code}`} style={{ width: '100%', height: '100%' }}
                          extent={[+d.value[0] - 0.005, +d.value[1] - 0.005, +d.value[0] + 0.005, +d.value[1] + 0.005]}
                          point={[+d.value[0], +d.value[1]]}
                        />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 12, paddingTop: 4, cursor: 'pointer' }} onClick={() => window.open(d.url, '_blank')}>
                        View in Maps
                      </div>
                    </div>
                  )}
                </div>
                {
                  multipleData.filter(d => d.type === 'survey-date').map((singleData, index) =>
                    <div key={index} style={{ width: '50%', fontWeight: 'bold', fontSize: 14 }}>
                      Surveyed {relativeTime(singleData.value)}
                      <hr />
                    </div>
                  )}
                <div style={{ display: 'table' }}>
                  {multipleData.filter(d => !d.type).map((singleData, index) =>
                    <div key={index} style={{ display: 'table-row', width: '50%', fontSize: '12px' }}>
                      <span style={{ display: 'table-cell', fontWeight: 'bold', minWidth: '17vw' }}>{singleData.label}</span>
                      <span style={{ display: 'table-cell', paddingLeft: 10 }}>{isValidDateString(singleData.value) ? formatDate(singleData.value) : singleData.value}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <hr />
          </div>
        )}

      </div>
    </div>
  )
};


export default compose(
  connect(
    state => ({
      householdDetail: state.householdDetail,
      session: state.session
    }),
    dispatch => ({
      setSession: (key, value) => dispatch(setSession(key, value)),
      fetchUserHouseHoldDetail: (countryCode, projectCode, householdId) => dispatch(fetchUserHouseHoldDetail(countryCode, projectCode, householdId))
    })
  ),

  withRouter,

  lifecycle({
    componentDidMount() {
      const projectCode = this.props.match.params.projectCode;
      const countryCode = this.props.match.params.countryCode;
      const householdId = this.props.match.params.householdId;
      this.props.fetchUserHouseHoldDetail(countryCode, projectCode, householdId);
    }
  })
)(HouseholdDetail);
