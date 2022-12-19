import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatch(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const errors = { passwordMatch: { mismatch: true } };

  if (password?.value === confirmPassword?.value) {
    return null;
  }
  confirmPassword?.setErrors(errors);
  return errors;
}
