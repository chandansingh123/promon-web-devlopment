
import React from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import { QRCode } from 'react-qr-svg';

const styles = {
  container: {
    position: 'absolute',
    height: '100vh',
    width: 360,
    marginTop: -44 ,
    borderLeft: 'black solid .5px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    top: 0,
    right: 0,
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1
  }, 
  content: { 
    padding: 2, 
    overflowY: 'auto',
    fontSize: 10,
    flexGrow: 1
  }, 
  imageContainer: { 
    overflowX: 'auto', 
    display: 'flex', 
    height: 120,
    paddingTop: 2
  },
  qrCodeContainer: {
    textAlign: 'center' ,
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  qrCode: {
    padding: '0 5px',
    cursor: 'pointer'
  },
  qrCaption: {
    paddingTop: 2,
    fontSize: 10,
    letterSpacing: .5
  }
};

const stylesNew = StyleSheet.create ({
  imageDiv: {
    padding: 3,
    height: 115
  },
  image: {
    cursor: 'pointer',
    transition: '0.3s',
    maxHeight: 90,
    ':hover': {
      opacity: 0.7
    }
  }
});

class PopUp extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.houseHoldData !== this.props.houseHoldData)
  }

  render() {
    if (!this.props.houseHoldData) {
      return null;
    }

    const data = this.props.houseHoldData.data;
    const headers = data.filter(d => d.type === 'header');
    const header = headers && headers[0];
    const fields = data.filter(d => d.type === 'one' || d.type === 'two');
    const images = data.filter(d => d.type === 'image');
    let id = data.filter (d => d.type === 'id');
    if (id && Array.isArray(id))
      id = id[0];

    const locationUrl = data.filter(d => d.label === 'location-url');
    const detailPageUrl = data.filter(d => d.label === 'hhsdetail-url');

    return (
      <div style={{ display: this.props.visible ? 'block' : 'none' }}>

        <div style={styles.container} >
          <div style={{ height: 44 }} />

          { header &&
            <div>
              <h6 style={{ margin: '0px', textAlign: 'center' }} className='pm-map-pop-up-header'>
                {header.label} {header.label && ':'} {header.value}
              </h6>
              <hr style={{ margin: '1px 0' }} />
            </div>
          }

          <div style={styles.content} >
            {fields.map((field, index) => (
                <div key={index}>
                  <div style={{display: 'inline-block', verticalAlign: 'top', fontWeight: 'bold'}}>{field.label}:</div>
                  <div style={{display: 'inline-block', width: 150, paddingLeft: 2}}>{field.value}</div>
                </div>
              ))}
          </div>

          <hr style={{margin: 0}}/>

          <div style={styles.imageContainer} >
            {images.map((image, index) =>
              <div className={`${css(stylesNew.imageDiv)}`} key={index} onClick={() => this.props.setSession ('map.image', image.value[0])}>
                <img className={`${css(stylesNew.image)}`} src={image.value[1]} alt={image.label} />
                <span style={{ display: 'block', textAlign: 'center', fontSize: '10px', fontStyle: 'italic' }}>{image.label}</span>
              </div>
            )}
          </div>

          <div style={styles.qrCodeContainer}>
            <Link to={detailPageUrl[0].value} target='_blank'>
              <div style={styles.qrCode} >
                <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 75, height: 75 }}
                  value={detailPageUrl[0].value} />
                <div style={styles.qrCaption} >HHS Detail </div>
              </div>
            </Link>

            {
              locationUrl && !!locationUrl.length &&
              <Link to={locationUrl[0].value} target='_blank'>
                <div style={styles.qrCode}>
                  <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q"
                    style={{ width: 75, height: 75 }}
                    value={locationUrl[0].value} />
                  <div style={styles.qrCaption} >Location</div>
                </div>
              </Link>
            }
          </div>

          <div style={{ height: 196 }} />
        </div>
      </div>
    );
  }
}

export default PopUp;
