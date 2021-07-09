import {Component, OnInit, OnDestroy} from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {GpioService} from '../../../../Services/gpio.service';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {set} from '../../../../Services/ModeState';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-changemode',
  templateUrl: './changemode.component.html',
  styleUrls: ['./changemode.component.css']
})
export class ChangemodeComponent implements OnInit {
  btnClientState = false;
  btnServerState = false;
  alert = true;
  mode = '';
  mode$: Observable<string>;
  constructor(
    private localCon: LocalConnectionService,
    private gpioService: GpioService,
    private router: Router,
    private store: Store<{mode: string}>
  ) {
    this.mode$ = this.store.select('mode');
    this.mode$.pipe(take(1)).subscribe(res => {
      this.mode = res;
    });
  }

  ngOnInit(): void {
    this.mode$ = this.store.select('mode');
    this.mode$.pipe(take(1)).subscribe(res => {
      this.mode = res;
    });
  }

  shutdown(): void{
    this.localCon.ShutDownServer().subscribe( res => {
      if (res)
      {
        this.mode = null;
        this.gpioService.setMode('');
        const mode = '';
        this.store.dispatch(set({mode}));
      }
      else{
        this.alert = false;
      }
    }, error => {
      this.alert = false;
    });
  }
  setMode(mode: string){
    if (mode === 'Server'){
      this.localCon.CreateToken().subscribe( ServerToken => {
          const token = ServerToken.toString();
          if (token ) {
            this.localCon.SetMode(mode, token).subscribe(res => {
                if (res) {
                  this.router.navigate(['/get-token']);
                  this.gpioService.setMode(mode);
                  this.store.dispatch(set({mode}));
                  this.btnServerState = !this.btnServerState;
                  this.btnClientState = false;
                }
              },
              error => {
                this.alert = false;
                console.log(error.error);
              });
          }
          else {
            this.alert = false;
          }},
        error => {
          this.alert = false;
          console.log(error.error);
        }
      );
    }
    else{
      this.router.navigate(['connect']);
      this.btnClientState = !this.btnClientState;
      this.btnServerState = false;
    }
  }

}
