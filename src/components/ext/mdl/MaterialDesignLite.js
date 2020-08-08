
import 'material-design-lite/material.min.js';


// Override material-design-lite checkValidity property
window.MaterialTextfield.prototype.checkValidity = function (force = false) {

  // No action taken if not invoked explicitly
  if (!force) {
    this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    return true;
  }

  if (!this.input_)
    return true;

  if (this.input_.validity.valid)
    this.element_.classList.remove(this.CssClasses_.IS_INVALID);
  else
    this.element_.classList.add(this.CssClasses_.IS_INVALID);
  return this.input_.validity.valid;
}
