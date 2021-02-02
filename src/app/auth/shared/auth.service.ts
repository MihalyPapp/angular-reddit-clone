import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, of } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponsePayload } from '../login/login-response.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenPayload = {
    token: this.getRefreshToken(),
    username: this.getUsername()
  }

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8844/api/auth/signup', signupRequestPayload, { responseType: 'text' })
  }

  login(LoginRequestPayload: LoginRequestPayload): Observable<any> {
    return this.httpClient.post<LoginResponsePayload>('http://localhost:8844/api/auth/login', LoginRequestPayload)
      .pipe(
        map(data => {
          this.localStorage.store('authenticationToken', data.authenticationToken)
          this.localStorage.store('expiresAt', data.expiresAt)
          this.localStorage.store('refreshToken', data.refreshToken)
          this.localStorage.store('username', data.username)
          return true;
        }),
        catchError(() => {
          return of(false)
        })
      )
  }

  getJwtToken() {
    console.log("getJwtToken from localstorage")
    return this.localStorage.retrieve('authenticationToken')
  }

  refreshToken() {
    return this.httpClient.post<LoginResponsePayload>('http://localhost:8844/api/auth/refresh/token', this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        
        this.localStorage.store('authenticationToken', response.authenticationToken)
        this.localStorage.store('expiresAt', response.expiresAt)
      }))
  }
  getUsername() {
    return this.localStorage.retrieve('username')
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken')
  }

}
