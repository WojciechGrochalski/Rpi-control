import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GPIO} from '../Models/GPIO';

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  baseUrl = 'http://localhost:5000/api/Rpi';
  baseLocalUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  GetGpio(): Observable<any> {
    return this.http.get<GPIO[]>(this.baseUrl);
  }

  GetLocalGpio(): Observable<GPIO[]> {
    return this.http.get<GPIO[]>(this.baseLocalUrl + '/local/gpio');
  }
  SetPin( pin: GPIO) {
    return this.http.post(this.baseLocalUrl + 'changeGPIO', pin);
  }



}
