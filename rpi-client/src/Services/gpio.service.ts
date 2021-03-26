import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GPIO} from '../Models/GPIO';

@Injectable({
  providedIn: 'root'
})
export class GpioService {

  baseUrl = 'https://localhost:5000/api/Rpi';

  constructor(private http: HttpClient) {
  }

  GetGpio(): Observable<any> {

    return this.http.get<GPIO[]>(this.baseUrl);
  }
}
