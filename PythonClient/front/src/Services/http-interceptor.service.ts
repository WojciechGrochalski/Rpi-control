import {Inject, Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('cash') || request.url.includes('baseUrl') || request.url.includes('login')) {
      return next.handle(request);
    } else {
      if (request.url.includes('refreshToken')) {
        console.log('refresh');
        const refreshToken = localStorage.getItem('refreshToken');
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshToken}`,
            CORS: 'Access-Control-Allow-Origin'
          }
        });
        return next.handle(request);
      } else {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
        }
        return next.handle(request);
      }
    }


  }
}





