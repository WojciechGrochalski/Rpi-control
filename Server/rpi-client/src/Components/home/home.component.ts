import { Component, OnInit } from '@angular/core';
import {GPIO} from '../../Models/GPIO';
import {HttpClient} from '@angular/common/http';
import {GpioService} from '../../Services/gpio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'rpi-client';
  public data: GPIO[];
  constructor(
    private http: HttpClient,
    private gpioService: GpioService) {
  }

  async ngOnInit(){
    this.data =  await this.gpioService.GetGpio().toPromise();
    console.log(this.data);
  }
}
