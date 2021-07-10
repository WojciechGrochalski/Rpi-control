import {Component, OnDestroy, OnInit} from '@angular/core';
import {GPIO} from '../../../../Models/GPIO';
import {GpioService} from '../../../../Services/gpio.service';
import {LoginResult} from '../../../../Models/LoginResult';
import {interval, Observable, Subscription} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-gpio',
  templateUrl: './gpio.component.html',
  styleUrls: ['./gpio.component.css']
})
export class GpioComponent implements OnInit {
  mode = '';
  mode$: Observable<string>;
  User: LoginResult;
  interval: Subscription;
  Gpio: GPIO[];
  leftGpio: GPIO[];
  rightGpio: GPIO[];
  constructor(
    private gpioService: GpioService,
    private store: Store<{mode: string}> ) {
    this.mode$ = this.store.select('mode');
    this.mode$.subscribe(res => {
      this.mode = res;
    });
  }

  ngOnInit(): void {
    this.mode$ = this.store.select('mode');
    this.mode$.subscribe(res => {
      this.mode = res;
    });
    this.interval = interval(8000)
      .pipe(
        startWith(0),
        switchMap(() => this.gpioService.GetLocalGpio())
      ).subscribe(res => {
        this.Gpio = res.slice();
        this.leftGpio = res.splice(0, 19);
        this.rightGpio = res.splice(0, 20);
        this.SetColour();
        }, error => {
          console.log(error.error);
        }
      );

  }

  UpdateModePin(item: GPIO, newMode: string): void{
    const index = this.Gpio.findIndex(pin => pin.GPIONumber === item.GPIONumber);
    if (this.Gpio[index].GPIOMode !== newMode) {
      console.log(newMode);
      // if (newMode === 'out'){
      //   this.Gpio[index].GPIOStatus = 1;
      // }
      // else{
      //   this.Gpio[index].GPIOStatus = 0;
      // }
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
      // if (newStatus === 1){
      //   this.Gpio[index].GPIOMode = 'out';
      // }
      // else{
      //   this.Gpio[index].GPIOMode = 'in';
      // }
      this.Gpio[index].GPIOStatus = newStatus;
      this.gpioService.SetPin( this.Gpio[index]).subscribe();
      console.log(this.Gpio[index]);
    }
  }

  SetColour(): void{
    this.leftGpio.forEach( (item) => {
      if (item.GPIOName.includes('v')){
        item.color = 'red';
      }
      else{
          item.color = 'green';
      }
      if (item.GPIOName.includes('Ground')){
        item.color = 'blue';
      }
    });
    this.rightGpio.forEach( (item) => {
      if (item.GPIOName.includes('v')){
        item.color = 'red';
      }
      else{
        item.color = 'green';
      }
      if (item.GPIOName.includes('Ground')){
        item.color = 'blue';
      }
    });
  }


}
