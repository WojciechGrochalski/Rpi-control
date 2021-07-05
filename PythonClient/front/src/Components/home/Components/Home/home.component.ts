import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GpioService} from '../../../../Services/gpio.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'rpi-client';
  subscription: Subscription;
  mode = '';
  constructor(
    private gpioService: GpioService,
  ) {
    console.log('xd');
    this.mode = localStorage.getItem('mode').toString();
    console.log('xd', this.mode);
  }

  ngOnInit(): void {
    this.subscription = this.gpioService.getMode().subscribe(newMode => {
      this.mode = newMode;
      localStorage.setItem('mode', this.mode);
    });
    if (this.mode === null || this.mode === ''){
      this.mode = localStorage.getItem('mode').toString();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
