import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GpioService} from '../../../../Services/gpio.service';
import {Subscription} from 'rxjs';
import {Rpi} from '../../../../Models/Rpi';
import {LocalConnectionService} from '../../../../Services/local-connection.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  mode = '';
  constructor(
    private gpioService: GpioService,
    private conn: LocalConnectionService
  ) { }

  ngOnInit(): void {
    this.subscription = this.gpioService.getMode().subscribe(newmode => {
      this.mode = newmode;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
