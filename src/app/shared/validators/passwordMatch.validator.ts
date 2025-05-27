import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');

  // Return null if controls are not yet initialized or if passwordConfirm has no value (required handles empty)
  if (!password || !passwordConfirm || !passwordConfirm.value) {
    return null;
  }

  // Compare values
  if (password.value !== passwordConfirm.value) {
    // Set the error on the passwordConfirm control directly
    // Use { passwordMismatch: true } as the error object
    passwordConfirm.setErrors({ passwordMismatch: true });
    // Return an error at the FormGroup level as well (optional, but common)
    return { passwordMismatch: true };
  } else {
    // If they match, clear the error on passwordConfirm if it was previously set
    if (passwordConfirm.hasError('passwordMismatch')) {
      passwordConfirm.setErrors(null);
    }
    return null; // No error
  }
};
