import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalConnectionService {

  baseUrl = 'http://localhost:8080/';
  constructor(
    private http: HttpClient
  ) { }

  SetMode(body: string){

    return this.http.post(this.baseUrl + 'setMode', {mode: body} );
  }
}


