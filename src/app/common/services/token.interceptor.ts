import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HeaderService } from './header.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor class is used to intercept the all request to the api.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  /**
   * Variable which is used to check whether the token is refreshing or not.
   */
  isRefreshingToken: boolean;
  /**
   * Variable which is used to emit the token value
   */
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  /**
   * Constructor used to inject the required services.
   * @param headerService To get headers from the header service
   * @param authService To get the refresh token from the auth service
   * @param router To navigate to provided route.
   */

  constructor(private headerService: HeaderService, private authService: AuthService, private router: Router) { }
  /**
   * Method which is used to intercept the request.
   * @param request Which is used to define the request of the url.
   * @param next which is used to define the request passed for further processing.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // And passed the request to the next handler and process the returned response.
    return next.handle(this.setHeaders(request)).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        // If 401 error returned ,then we handle it.
        return this.handleError(request, next);
      }
      return throwError(err);
    }));
  }
  /**
   * Method which is used to handle the 401 error response.
   * @param request Which is used to define the request of the url.
   * @param next which is used to define the request passed for further processing.
   */
  private handleError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);
      return this.authService
        .getRefreshToken().pipe(switchMap((token: any) => {
          this.isRefreshingToken = false;
          this.refreshTokenSubject.next(token['accessToken']);
          this.headerService.setHeaders('default', 'Authorization', token['accessToken']);
          localStorage.setItem('token', token['accessToken']);
          return next.handle(this.setHeaders(request));
        }), catchError((err: any) => {
          this.isRefreshingToken = false;
          this.router.navigate(['/signin']);
          return throwError(err);
        }));
    } else {
      // when the new token is ready and we can retry the request again.
      return this.refreshTokenSubject.pipe(filter(token => token !== null),
        take(1),
        switchMap((jwt_token) => next.handle(this.setHeaders(request))));
    }
  }
  /**
   * Method which is used to set the headers for the request.
   * @param request Which is used to define the request of the url.
   */
  setHeaders(request: HttpRequest<any>) {
    // To get the headers for the given url
    const headers = this.headerService.getHeaders(request.url);
    // Add the headers to the cloned request and return it.
    return headers ? request.clone({
      setHeaders: headers
    }) : request;
  }
}
