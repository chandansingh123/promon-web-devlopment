
import React from 'react';

import Step from './Step';
import CancelButton from 'components/Admin/Common/CancelButton';
import ColoredButton from 'components/Admin/Common/ColoredButton';


class Stepper extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      currentStep: 0,
      completedSteps: [],
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.reset)
      this.setState ({ currentStep: 0 });
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

  onNextStep () {
    // Validate form before proceeding
    const forms = document.getElementById('rem-stepper-content').getElementsByTagName('form');
    if (forms) {
      const form = forms[0];
     if (form && !this.validateForm (form))
        return;
    }

    if (this.props.steps[this.state.currentStep].onNext) {
      this.props.steps[this.state.currentStep].onNext();
    }
    this.setState ({ currentStep: this.state.currentStep + 1});
  }

  onPreviousStep () {
    this.setState ({ currentStep: this.state.currentStep - 1 });
  }

  render () {
    const steps = this.props.steps || [];
    const stepWidth = 100 / steps.length;
    const stepCount = steps.length;

    const currentStep = +this.state.currentStep;
    const numberOfSteps = +steps.length - 1;

    return (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column'}} id={this.props.id} className='pm-stepper'>
        <div className='pm-stepper-step-container' style={{paddingTop: 20}}>
          <div className='pm-stepper-step-wrp'>
            {steps.map( (step,index) =>
                <Step style={{width:`${stepWidth}%`, paddingBottom: 18}} key={index} {...step} index={index} count={stepCount}
                  done={this.state.completedSteps.includes(index)} active={currentStep === index}/>)}
          </div>
        </div>

        <div id='rem-stepper-content' style={{height: 'calc(100vh - 244px)', overflowY: 'auto'}}>
          { (currentStep >= 0 && currentStep <= numberOfSteps) && steps[currentStep].component }
        </div>

        <div style={{paddingBottom: 12, paddingRight: 12}}>
          <hr />
          <div style={{float: 'right'}}>
            <CancelButton id={`${this.props.id}-cancel`} onClick={this.props.cancel} style={{marginRight: 10}} />
            <ColoredButton id={`${this.props.id}-prev`} label={'Previous'} disabled={!currentStep}
                style={{marginRight: 10}} onClick={this.onPreviousStep.bind(this)} />
            {
              currentStep === numberOfSteps ?
              <ColoredButton id={`${this.props.id}-save`} label='Finish'  onClick={this.props.onFinish} /> :
              <ColoredButton id={`${this.props.id}-next`} label='Next' onClick={this.onNextStep.bind(this)} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Stepper;
