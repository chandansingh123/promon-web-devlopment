
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import PersonOutline from 'images/person_outline.svg';
import Project from 'images/project.svg';
import OMKFile from 'images/file.svg';
import OLWrapper from 'components/ext/openlayers';
import { chartColors } from 'store/globalObject';

const styles = StyleSheet.create ({
  title: {
    fontSize: 30,
    borderBottom: '2px solid #bababa',
    marginBottom: 20
  },
  infographic: {
    minHeight: 100,
    height: 160,
    display: 'flex',
    flexDirection: 'column',
    color: '#6f6f6f',
    background: '#ebebeb',
    webkitTransition: 'all 300ms linear',
    MozTransition: 'all 300ms linear',
    MsTransition: 'all 300ms linear',
    transition: 'all 300ms linear',
    ':hover': {
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)'
    }
  },
  infographicImage: {
    height: 100,
    width: 100,
    lineHeight: '100px',
    margin: 20
  },
  infographicCount: {
    fontSize: '6em',
    height: 100,
    lineHeight: 1,
    margin: 20,
    '@media (max-width: 992px)': {
      fontSize: '4em',
    }
  }
});


class Dashboard extends React.Component {

  componentWillMount () {
    this.props.fetchProjectsSummary ();
  }

  renderInfographic (logo, text, count) {
    return (
      <div className={`mdl-cell mdl-cell--3-col mdl-card ${css(styles.infographic)}`} >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div className={`${css(styles.infographicCount)}`}>{count}</div>
          <div className={`${css(styles.infographicImage)}`}><img src={logo} alt={text} style={{maxHeight: 60, maxWidth: 60}}/></div>
        </div>
        <div style={{paddingBottom: 4, textAlign: 'center'}}>{text}</div>
      </div>
    );
  }

  renderMap () {
    const country = this.props.session.country;
    const projects = Object.values (this.props.projectsSummary.data);
    projects.forEach ((p, idx) => p.color = chartColors[idx]);

    return (
      <div style={{display: 'flex', flexDirection: 'row', margin: 20}} >
        {country &&
          <OLWrapper id='rem-admin-dashboard-map'
              extent = {[country.min_longitude, country.min_latitude, country.max_longitude, country.max_latitude]}
              style={{height: '40vw', width: '60vw', maxHeight: 500, maxWidth: 1000 }}
              pointSet={projects}
          />
        }
        <div style={{width: 300}}>
          {
            projects.map ((project, idx) => (
              <div key={idx} style={{margin: 5, fontSize: 13, lineHeight: 1.3}}>
                <span style={{width: 13, height: 13, float: 'left', verticalAlign: 'middle', margin: '2px 5px 2px 2px', backgroundColor: project.color}} />
                <div style={{ display: 'inline-block', width: 260}} title={project.name}>
                  {project.name} ({project.points.length})
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  render () {
    return (
      <div style={{padding:20}}>
        <h1 className={`${css(styles.title)}`}>Project Management Tool</h1>
        <div className="mdl-grid">
          {this.renderInfographic (Project, 'Current Projects', Object.values(this.props.projects.data).length)}
          {this.renderInfographic (PersonOutline, 'Active Users', Object.values(this.props.users.data).length)}
          {this.renderInfographic (OMKFile, 'Survey Files', Object.values(this.props.omkSurvey.data).length)}
        </div>

        { this.renderMap() }
      </div>
    );
  }
}

export default Dashboard;
