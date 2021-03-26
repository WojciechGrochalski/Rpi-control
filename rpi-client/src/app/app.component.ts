import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GPIO} from '../Models/GPIO';
import {GpioService} from '../Services/gpio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
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
