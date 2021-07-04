import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {GPIO} from '../Models/GPIO';

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  baseUrl = 'http://localhost:5000/api/Rpi';
  baseLocalUrl = 'http://localhost:5000/';
  private mode = new Subject<string>();
  actuallyMode = '';

  getMode(): Observable<string>{
    return this.mode.asObservable();
  }
  getModeString(): string{
    return this.actuallyMode;
  }
  setMode(mode: string): void{
    this.mode.next(mode);
    this.actuallyMode = mode;
  }
  constructor(private http: HttpClient) {
  }

  GetGpio(): Observable<any> {
    return this.http.get<GPIO[]>(this.baseUrl);
  }

  GetLocalGpio(): Observable<GPIO[]> {
    return this.http.get<GPIO[]>(this.baseLocalUrl + 'local/gpio');
  }
  SetPin( pin: GPIO) {
    return this.http.post(this.baseLocalUrl + 'changeGPIO', pin);
  }



}