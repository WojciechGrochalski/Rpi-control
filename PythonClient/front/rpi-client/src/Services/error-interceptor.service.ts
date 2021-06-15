import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {UserService} from './User.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private userService: UserService ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.status === 401) {
        console.log('err 401');
        return this.userService.RefreshToken()
          .pipe(switchMap((newAccessToken: any) => {
            newAccessToken = localStorage.getItem('accessToken');
            return next.handle(this.addToken(request, newAccessToken));
          }));
      }
      return throwError(err);

    }));
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
