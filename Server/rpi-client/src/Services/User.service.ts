import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Token} from '../Models/Token';
import {NewTokens} from '../Models/NewTokens';
import {JwtHelperService} from '@auth0/angular-jwt';
import {tap} from 'rxjs/operators';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {


  BaseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string ) {
    this.BaseUrl = baseUrl;
  }


  VerifyUser(token: string): Observable<any> {
    const jwtToken = new Token(token);
    return this.http.post(this.BaseUrl + 'User/verify-email', jwtToken);
  }

  VerifyPasswordToken(token: string): Observable<any> {
    const jwtToken = new Token(token);
    return this.http.post(this.BaseUrl + 'User/verify-resetpassword', jwtToken);
  }

  RefreshToken() {
    return this.http.get<NewTokens>(this.BaseUrl + 'User/refreshToken').pipe(tap
    ((tokens: any) => {
      this.storeJwtToken(tokens);
    }));
  }

  private storeJwtToken(tokens: any) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  CheckThatTokenNotExpired(token: string): boolean {
    const isExpired = jwtHelper.isTokenExpired(token);
    if (isExpired) {
      return true;
    }
    return false;
  }
}
