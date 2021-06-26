import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface JWT{
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class LocalConnectionService {

  baseUrl = 'http://localhost:8080/';
  constructor(
    private http: HttpClient
  ) { }

  SetMode(body: string, portNumber = 8085){
    return this.http.post(this.baseUrl + 'setMode', {mode: body, port: portNumber} );
  }

  GetToken(): Observable<JWT> {
    return this.http.get<JWT>(this.baseUrl + 'getToken');
  }
  CreateToken() {
    return this.http.get(this.baseUrl + 'createToken');
  }
}



