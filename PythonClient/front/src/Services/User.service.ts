import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
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
}
