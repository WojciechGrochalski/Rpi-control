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
  leftGpio: GPIO[];
  rightGpio: GPIO[];

  constructor(
    private http: HttpClient,
    private gpioService: GpioService) {
  }

  async ngOnInit(){
     this.gpioService.GetGpio().subscribe( res => {
      this.leftGpio = res.splice(0, 20);
      this.rightGpio = res.splice(0, 20);
      this.SetColour();
      console.log(this.rightGpio);
    });
  }
  SetColour(){
  this.leftGpio.forEach( (item) => {
    if (item.GPIOName.includes('GPIO')){
      item.color = 'green';
    }
    else{
      item.color = 'red';
    }
    if (item.GPIOName.includes('Ground')){
      item.color = 'blue';
    }
  });
  this.rightGpio.forEach( (item) => {
      if (item.GPIOName.includes('GPIO')){
        item.color = 'green';
      }
      else{
        item.color = 'red';
      }
      if (item.GPIOName.includes('Ground')){
        item.color = 'blue';
      }
    });
  }
}
