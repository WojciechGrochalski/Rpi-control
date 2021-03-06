import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {GpioService} from '../../../../Services/gpio.service';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Rpi} from '../../../../Models/Rpi';
import {Store} from '@ngrx/store';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  mode$: Observable<string>;
  mode = '';
  RpiClients: Rpi[];
  constructor(
    private gpioService: GpioService,
    private conn: LocalConnectionService,
    private store: Store<{mode: string}>
  ) {
    this.mode$ = this.store.select('mode');
    this.mode$.pipe(take(1)).subscribe(res => {
      this.mode = res;
      console.log('mode', this.mode);
    });
    this.conn.RpiClients().subscribe(res => {
      this.RpiClients = res;
    });
    this.checkState();

    console.log('mode', this.mode);
  }

  ngOnInit(): void {
    this.mode$ = this.store.select('mode');
    this.mode$.subscribe(res => {
      this.mode = res;
    });
    this.conn.RpiClients().subscribe(res => {
      this.RpiClients = res;
    });
    this.checkState();
  }
  checkState(): void{
    let state = '';
    try {
      state = sessionStorage.getItem('state');
    }
    catch (e) {
      state = '';
    }
    if (state !== ''){
      this.mode = state;
    }
  }
}
