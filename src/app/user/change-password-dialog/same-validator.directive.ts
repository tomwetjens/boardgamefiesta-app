import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[same]',
  providers: [{provide: NG_VALIDATORS, useExisting: SameValidator, multi: true}]
})
export class SameValidator implements Validator {

  @Input('same') otherValue: string;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value !== this.otherValue
      ? {same: true} : null;
  }

}
