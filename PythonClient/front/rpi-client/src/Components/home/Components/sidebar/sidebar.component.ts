import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {GpioService} from '../../../../Services/gpio.service';
import {Subscription} from 'rxjs';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  mode = '';
  constructor(
    private gpioService: GpioService
  ) { }

  ngOnInit(): void {
    this.subscription = this.gpioService.getMode().subscribe(newmode => this.mode = newmode);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
