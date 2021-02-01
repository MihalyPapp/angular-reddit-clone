import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './login-request.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isError = false
  loginRequestPayload: LoginRequestPayload
  registerSuccessMessage: string = '';

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.loginRequestPayload = {
      username: '',
      password: '',
    };
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.registered !== undefined && params.registered === 'true') {
        this.toastr.success('Signup successful!')
        this.registerSuccessMessage = 'Please check your inbox for activation email.'
      }
    })
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username')?.value;
    this.loginRequestPayload.password = this.loginForm.get('password')?.value;
    this.authService.login(this.loginRequestPayload).subscribe(data => {
      if (data) {
        console.log("navigate to '/'")
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastr.success('Login successful!')
      } else {
        this.isError = true;
      }
    })
  }
}
