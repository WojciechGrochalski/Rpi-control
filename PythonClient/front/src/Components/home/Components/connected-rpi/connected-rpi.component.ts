import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Rpi} from '../../../../Models/Rpi';
import {interval, Observable, Subject, Subscription, timer} from 'rxjs';
import {map, retry, share, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-connected-rpi',
  templateUrl: './connected-rpi.component.html',
  styleUrls: ['./connected-rpi.component.css']
})
export class ConnectedRpiComponent implements OnInit, OnDestroy {

  interval: Subscription;
  RpiClients: Rpi[];

  constructor(
    private http: HttpClient,
    private conn: LocalConnectionService
  ) {
  }

  ngOnInit(): void {
    this.interval = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.conn.RpiClients())
      ).subscribe(res => {
        this.RpiClients = res;
        this.RpiClients.forEach(item => {
          const time = new Date(item.Lastactivity);
          const currentDate = new Date(Date.now());
          const diffTime = Math.abs(time.getTime() - currentDate.getTime());
          item.Lastactivity = diffTime.toString();
        });
      }, error => {
        console.log(error.error);
      }
      );
  }


  ngOnDestroy() {
    this.interval.unsubscribe();
  }
}

