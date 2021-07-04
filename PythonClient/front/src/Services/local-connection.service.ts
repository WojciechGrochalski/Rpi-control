import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, Subscription, timer} from 'rxjs';
import {Connect} from '../Models/Connect';
import {Rpi} from '../Models/Rpi';
import {retry, share, switchMap, takeUntil, tap} from 'rxjs/operators';

export interface JWT{
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class LocalConnectionService {

  baseUrl = 'http://localhost:5000/';

  constructor(
    private http: HttpClient ) { }

  SetMode(body: string, Servertoken?: string, portNumber = 8085){
    return this.http.post(this.baseUrl + 'setMode', {mode: body, port: portNumber, token: Servertoken} );
  }

  GetToken(): Observable<JWT> {
    return this.http.get<JWT>(this.baseUrl + 'getToken');
  }
  CreateToken() {
    return this.http.get(this.baseUrl + 'createToken');
  }

  ConnectToServer(conn: Connect){
    return this.http.post(this.baseUrl + 'connect', conn );
  }
  DisconnectFromServer(data: number){
    return this.http.post(this.baseUrl + 'disconnect', {port: data} );
  }

  ShutDownServer(){
    return this.http.get(this.baseUrl + 'shutdown_server');
  }

  RpiClients(){
    return this.http.get<Rpi[]>(this.baseUrl + 'clients');
  }

}



