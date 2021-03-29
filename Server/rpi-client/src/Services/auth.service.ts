import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreatedUser} from '../Models/CreatedUser';

import {AuthModel} from '../Models/AuthModel';
import {LoginResult} from '../Models/LoginResult';
import {NewPassword} from '../Models/NewPassword';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<LoginResult>;
  public currentUser: Observable<LoginResult>;
  BaseUrl = '';
  helper = new JwtHelperService();

  constructor(private http: HttpClient,
              @Inject('BASE_URL') baseUrl: string) {
    this.BaseUrl = baseUrl;
    this.currentUserSubject = new BehaviorSubject<LoginResult>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginResult {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Check whether the token is expired and return
      // true or false
      return !this.helper.isTokenExpired(token);
    }
    return false;
  }

  Register(user: CreatedUser) {
    return this.http.post<any>(this.BaseUrl + 'User', user);
  }

  ResetPassword(Email: string) {
    const data = new NewPassword('', Email);
    return this.http.post<any>(this.BaseUrl + 'User/resetPassword', data);
  }

  SetNewPassword(data: NewPassword) {

    return this.http.post<any>(this.BaseUrl + 'User/setPassword', data);
  }


  login(user: AuthModel) {
    return this.http.post<LoginResult>(this.BaseUrl + 'User/login', user)
      .pipe(map( user => {
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('accessToken', (user.accessToken));
          localStorage.setItem('refreshToken', (user.refreshToken));
          user.refreshToken = null;
          user.accessToken = null;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }
}
