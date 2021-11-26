import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Connect} from '../Models/Connect';
import {Rpi} from '../Models/Rpi';
import {environment} from '../environments/environment.prod';

export interface JWT {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalConnectionService {

  baseUrl = environment.base_url;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    const splitAddress = baseUrl.split(':', 2);
    const ip = splitAddress[0].toString() + ':' + splitAddress[1].toString();
    this.baseUrl = ip + ':5000/';
  }

  SetMode(body: string, ServerToken?: string, portNumber = 8085) {
    return this.http.post(this.baseUrl + 'setMode', {mode: body, port: portNumber, token: ServerToken});
  }

  GetToken(): Observable<JWT> {
    return this.http.get<JWT>(this.baseUrl + 'getToken');
  }

  CreateToken() {
    return this.http.get(this.baseUrl + 'createToken');
  }

  ConnectToServer(conn: Connect) {
    return this.http.post(this.baseUrl + 'connect', conn);
  }

  DisconnectFromServer(data: number) {
    return this.http.post(this.baseUrl + 'disconnect', {port: data});
  }

  ShutDownServer() {
    return this.http.get(this.baseUrl + 'shutdown_server');
  }

  RpiClients() {
    return this.http.get<Rpi[]>(this.baseUrl + 'clients');
  }
}



