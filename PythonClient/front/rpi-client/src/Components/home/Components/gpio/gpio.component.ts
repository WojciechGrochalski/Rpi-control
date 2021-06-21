import { Component, OnInit } from '@angular/core';
import {GPIO} from '../../../../Models/GPIO';
import {GpioService} from '../../../../Services/gpio.service';
import {AuthService} from '../../../../Services/auth.service';
import {LoginResult} from '../../../../Models/LoginResult';

@Component({
  selector: 'app-gpio',
  templateUrl: './gpio.component.html',
  styleUrls: ['./gpio.component.css']
})
export class GpioComponent implements OnInit {
  User: LoginResult;
  public data: GPIO[];
  leftGpio: GPIO[];
  rightGpio: GPIO[];
  constructor(
    private gpioService: GpioService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.User = this.authService.currentUserValue;

      this.gpioService.GetGpio().subscribe(res => {
        this.leftGpio = res.splice(0, 20);
        this.rightGpio = res.splice(0, 20);
        this.SetColour();
        console.log(this.rightGpio);
      });

  }
  SetColour(): void{
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
