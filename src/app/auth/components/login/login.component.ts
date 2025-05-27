import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {CartService} from "../../../cart/services/cart.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ){  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;

    const {username, password} = this.loginForm.value;

    this.authService.login(username,password)
      .subscribe({
        next: (response) => {
          console.log(response['message']);
          this.router.navigate(['']);
          this.authService.checkLogin();
          this.cartService.getCart().subscribe();
          this.isLoading = false;
        },
        error: (res) => {
          this.errorMessage = res.error.error;
          console.error(res);
          this.isLoading = false;
        }
      })
  }
}
