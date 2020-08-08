
import React from 'react';


class ErrorHandler extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });

    // TODO log error to backend.
  }

  render () {
    if (this.state.hasError) {
      return (
        <div className="mdl-cell--10-col mdl-cell--1-offset">
          <h3>Oops! The system crashed.</h3>
          <div>Please provide some information so that we can discover the cause of the bug and fix it.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorHandler;
