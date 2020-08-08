
import React from 'react';

import Step from './Step';
import ColoredButton from 'components/Admin/Common/ColoredButton';


class Stepper extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      activeStep:1,
      stepsCompleted:[],
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.reset)
      this.setState ({ activeStep:1 });
  }

  componentDidUpdate () {
    window.componentHandler.upgradeAllRegistered();
  }

  validateForm (frm) {
    let isValid = true;
    const inputElements = frm.getElementsByClassName('mdl-textfield');
    for (let i = 0; i < inputElements.length; i++) {
      const flag = inputElements[i].MaterialTextfield && inputElements[i].MaterialTextfield.checkValidity (true);
      isValid = isValid && flag;
    }
    return isValid;
  }

  handleNext () {
    // Validate form before proceeding
    const forms = document.getElementById('rem-stepper-content').getElementsByTagName('form');
    if (forms) {
      const form = forms[0];
     if (form && !this.validateForm (form))
        return;
    }

    if (this.props.steps[this.state.activeStep].handleNext)
      this.props.steps[this.state.activeStep].handleNext();
    this.setState ({ activeStep: this.state.activeStep + 1});
    if (this.props.onProgress)
      this.props.onProgress();
  }

  handlePrev () {
    this.setState ({activeStep: this.state.activeStep - 1});
  }

  render () {
    
    const button = this.state.activeStep === Object.values(this.props.steps).length ?
              <ColoredButton id={`${this.props.id}-save`} label={this.props.finalButtonLabel || 'Finish'}  onClick={this.props.onFinish} /> :
              <ColoredButton id={`${this.props.id}-next`} label='Next' onClick={this.handleNext.bind(this)} />;
    
    const stepWidth = 100 / Object.values(this.props.steps).length;

    const stepCount = Object.values (this.props.steps).length;
    
    return (
      <div style={this.props.style} id={this.props.id} className='pm-stepper'>
        <div className='pm-stepper-step-container' style={{paddingTop: 20}}>
          <div className='pm-stepper-step-wrp'>
            {Object.values(this.props.steps).map( (step,index) =>
                <Step style={{width:`${stepWidth}%`, paddingBottom: 18}} key={index} {...step} index={index} count={stepCount}
                  done={this.state.stepsCompleted.includes(step['step'])} active={ this.state.activeStep === step['step']}/>)}
          </div>
        </div>

        <div id='rem-stepper-content' style={{height: 300}}>
          {this.props.steps[this.state.activeStep].component}
        </div>

        <hr />

        <div className='pm-stepper-button-wrp clearfix' style={{paddingBottom: 12, paddingRight: 12}}>
          <div className='pm-stepper-button-container'>
            {this.props.steps[this.state.activeStep].buttons && this.props.steps[this.state.activeStep].buttons.map( button => button)}
            <ColoredButton id={`${this.props.id}-prev`} label={'Prev'} disabled={this.state.activeStep === 1} onClick={this.handlePrev.bind(this)} />
            {button}
          </div>
        </div>
      </div>
    );
  }
}

export default Stepper;
