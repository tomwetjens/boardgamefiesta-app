import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[notSame]',
  providers: [{provide: NG_VALIDATORS, useExisting: NotSameValidator, multi: true}]
})
export class NotSameValidator implements Validator {

  @Input('notSame') otherValue: string;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value === this.otherValue
      ? {notSame: true} : null;
  }

}
