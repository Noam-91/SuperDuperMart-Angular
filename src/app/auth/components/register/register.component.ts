import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {passwordMatchValidator} from "../../../shared/validators/passwordMatch.validator";
import {AuthService} from "../../services/auth.service";
import IUser from "../../../shared/models/IUser";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

/** Regex for Names (First Name, Last Name, City)
Allows letters (basic Latin alphabet a-z, A-Z), spaces, hyphens, and apostrophes.
Requires at least one non-whitespace character.*/
  namePattern: RegExp = /^(?!\s*$)[a-zA-Z\s'-]+$/;

/** Regex for US Zip Codes
Matches 5 digits (e.g., 12345) or 5 digits followed by a hyphen or space and 4 digits (e.g., 12345-6789 or 12345 6789).
NOTE: This is specific to the United States. Postal codes vary significantly by country.*/
  zipPattern: RegExp = /^\d{5}(?:[-\s]?\d{4})?$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){  }

  ngOnInit(): void {
    // Initialize the FormGroup with form controls and validators
    this.registerForm = this.fb.group({
      // Required inputs
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],   // Custom validator will check if it matches the password
      email: ['', [Validators.required, Validators.email]],

      // Optional inputs below
      firstName: ['', [Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.pattern(this.namePattern)]],

      // Address, City, Country, Postal Code: Optional
      address: [''],
      city: ['', [Validators.pattern(this.namePattern)]],
      state: [''],
      zip: ['', [Validators.pattern(this.zipPattern)]]
    }, {
      // Apply the custom password match validator at the FormGroup level
      validators: passwordMatchValidator
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;
    const {passwordConfirm, ...user} = this.registerForm.value;

    this.authService.register(user).subscribe({
      next: res=>{
        console.log(res);
        this.router.navigate(['login']);
        this.isLoading = false;
      },
      error: err=>{
        console.error(err);
        const allErrorMsg = Object.values(err.error).reduce((acc:string,msg)=>acc+msg, '')
        this.errorMessage = allErrorMsg;
        this.isLoading = false;
      }
    })
  }

}

