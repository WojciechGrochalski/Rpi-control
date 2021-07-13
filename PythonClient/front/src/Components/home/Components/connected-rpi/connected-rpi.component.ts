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
    this.interval = interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => this.conn.RpiClients())
      ).subscribe(res => {
        if (res.toString() !== 'No Clients') {
          this.RpiClients = res;
          this.RpiClients.forEach(item => {
            console.log(item.Lastactivity);
            item.Lastactivity = new Date(item.Lastactivity).toString();
          });
        }
      }, error => {
        console.log(error.error);
      }
      );
  }


  ngOnDestroy(): void{
    this.interval.unsubscribe();
  }
}

