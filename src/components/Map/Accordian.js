
import React from 'react';

const styles = {
  header: {
    fontSize: 20,
    fontVariant: 'small-caps',
    paddingLeft: 20,
    display: 'inline',
    verticalAlign: 'middle'
  },
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 5
  },
  section: {
    padding: '8px 10px 8px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0,0,0, 0.1)'
  },
  image: {
    maxHeight: 24,
    maxWidth: 24
  },
  button: {
    float: 'right',
    paddingTop: 8,
    paddingRight: 10
  }
}

class Accordian extends React.Component {

  toggle () {
    if (this.props.ui['map.accordian'] === this.props.section)
      this.props.setUi ('map.accordian', '');
    else
      this.props.setUi ('map.accordian', this.props.section);
  }

  render () {
    const expanded = (this.props.ui['map.accordian'] === this.props.section);

    return (
      <section style={styles.section}>
        <div onClick={this.toggle.bind(this)}>
          { this.props.icon && <img src={this.props.icon} alt='' style={styles.image} /> }
          <h3 style={styles.header}>{this.props.header}</h3>
          <i className="material-icons" style={styles.button} >
            { expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }
          </i>
        </div>

        { expanded  &&  <div style={styles.body} > {this.props.body} </div> }
      </section>   
    );
  }
}

export default Accordian;
