import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { LoginResponsePayload } from "./auth/login/login-response.payload";
import { AuthService } from "./auth/shared/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null)

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.indexOf('refresh') !== -1 || request.url.indexOf('login') !== -1)
            return next.handle(request);

        const jwtToken = this.authService.getJwtToken()
        console.log("token: " + jwtToken)

        if (jwtToken) {
            return next.handle(this.addToken(request, jwtToken)).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 403)
                    return this.handleAuthErrors(request, next)
                else
                    return throwError(error)
            }))
        }
        return next.handle(request)
    }

    addToken(request: HttpRequest<any>, jwtToken: any) {
        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + jwtToken)
        })
    }

    private handleAuthErrors(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null)
            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponsePayload) => {
                    this.isTokenRefreshing = false
                    this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken)
                    return next.handle(this.addToken(request, refreshTokenResponse.authenticationToken))
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => {
                    return next.handle(this.addToken(request, this.authService.getJwtToken()))
                })
            )
        }
    }

}