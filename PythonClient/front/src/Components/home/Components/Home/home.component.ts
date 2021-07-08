import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GpioService} from '../../../../Services/gpio.service';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Rpi} from '../../../../Models/Rpi';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'rpi-client';
  subscription: Subscription;
  mode = '';
  RpiClients: Rpi[];
  constructor(
    private gpioService: GpioService,
    private conn: LocalConnectionService
  ) {
    if (localStorage.getItem('mode')){
      this.mode = localStorage.getItem('mode').toString() ;
    }
  }

  ngOnInit(): void {
    this.subscription = this.gpioService.getMode().subscribe(newMode => {
      this.mode = newMode;
      localStorage.setItem('mode', this.mode);
    });
    if (this.mode === null || this.mode === ''){
      if (localStorage.getItem('mode')){
        this.mode = localStorage.getItem('mode').toString() ;
      }
    }
    this.conn.RpiClients().subscribe(res => {
      this.RpiClients = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
