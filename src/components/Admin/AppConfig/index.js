
import React from 'react';

import Settings from './Settings';

class AppConfig extends React.Component {

  componentWillMount () {
    this.props.fetchAllAppSettings();
  }

  render () {
    return (
      <div>
        <Settings data={this.props.appSettings.data} />
      </div>
    );
  }
}

export default AppConfig;
