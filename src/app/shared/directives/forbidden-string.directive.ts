import { Directive, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from "@angular/forms";

@Directive({
    selector: '[forbidString]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenStringValidatorDirective, multi: true }]
})
export class ForbiddenStringValidatorDirective implements Validator {
    @Input('forbidString') check: boolean | number;
    validate(control: AbstractControl): { [key: string]: any } | null {
        return !!this.check ? forbiddenStringValidator(this.check)(control) : null;
    }
}

export function forbiddenStringValidator(check: boolean|number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = typeof control.value == 'string';
        return forbidden && !!check ? { 'forbiddenName': { value: control.value } } : null;
    };
}