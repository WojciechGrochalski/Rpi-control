import { Component, OnInit } from '@angular/core';
import {GPIO} from '../../../../Models/GPIO';
import {GpioService} from '../../../../Services/gpio.service';
import {AuthService} from '../../../../Services/auth.service';
import {LoginResult} from '../../../../Models/LoginResult';
import {interval, Subscription} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {LocalConnectionService} from '../../../../Services/local-connection.service';

interface Pin{
  Number: number;
  Mode: string;
  Status: number;
}
@Component({
  selector: 'app-gpio',
  templateUrl: './gpio.component.html',
  styleUrls: ['./gpio.component.css']
})
export class GpioComponent implements OnInit {
  User: LoginResult;
  interval: Subscription;
  Gpio: GPIO[];
  leftGpio: GPIO[];
  rightGpio: GPIO[];
  constructor(
    private gpioService: GpioService,
    private authService: AuthService,
    private conn: LocalConnectionService ) { }

  ngOnInit(): void {
    this.User = this.authService.currentUserValue;
    //this.gpioService.GetLocalGpio().subscribe( res => this.Gpio = res);
    this.interval = interval(8000)
      .pipe(
        startWith(0),
        switchMap(() => this.gpioService.GetLocalGpio())
      ).subscribe(res => {
        this.Gpio = res.slice();
        this.leftGpio = res.splice(0, 20);
        this.rightGpio = res.splice(0, 20);
        this.SetColour();
        }, error => {
          console.log(error.error);
        }
      );
    // this.gpioService.GetLocalGpio().subscribe(res => {
    //   this.leftGpio = res.splice(0, 20);
    //   this.rightGpio = res.splice(0, 20);
    //   this.SetColour();
    // });
    // this.gpioService.GetLocalGpio().subscribe(res => {
    //   this.Gpio = res;
    // });
  }

  UpdateModePin(item: GPIO, newMode: string): void{
    const index = this.Gpio.findIndex(pin => pin.GPIONumber === item.GPIONumber);
    if (this.Gpio[index].GPIOMode !== newMode) {
      console.log(newMode);
      this.Gpio[index].GPIOMode = newMode;
      this.gpioService.SetPin( this.Gpio[index]).subscribe();
      console.log(this.Gpio[index]);
    }

  }
  UpdateStatusPin(item: GPIO, value: string): void{
    const newStatus = +value;
    const index = this.Gpio.findIndex(pin => pin.GPIONumber === item.GPIONumber);
    if (this.Gpio[index].GPIOStatus !== newStatus) {
      console.log(newStatus);
      this.Gpio[index].GPIOStatus = newStatus;
      this.gpioService.SetPin( this.Gpio[index]).subscribe();
      console.log(this.Gpio[index]);
    }
  }
  ChangePin(unit: number, newMode: string, newStatus: number): void{
    console.log(unit , newMode , newStatus);
    const newPin: Pin = {
      Number: unit,
      Mode: newMode,
      Status: newStatus
    };
    console.log(newPin);

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
