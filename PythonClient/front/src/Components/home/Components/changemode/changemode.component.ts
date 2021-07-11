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
      console.log('mode', this.mode);
    });
    this.checkState();
    console.log('mode', this.mode);
  }

  ngOnInit(): void {
    this.mode$ = this.store.select('mode');
    this.mode$.pipe(take(1)).subscribe(res => {
      this.mode = res;
    });
    this.checkState();
  }

  shutdown(): void{
    this.localCon.ShutDownServer().subscribe( res => {
      if (res)
      {
        this.mode = null;
        this.gpioService.setMode('');
        const mode = '';
        this.store.dispatch(set({mode}));
        sessionStorage.setItem('state', mode);
        this.checkState();
      }
      else{
        this.alert = false;
      }
    }, error => {
      this.alert = false;
    });
  }
  setMode(currentMode: string){
    if (currentMode === 'Server'){
      this.localCon.CreateToken().subscribe( ServerToken => {
          const token = ServerToken.toString();
          if (token ) {
            this.localCon.SetMode(currentMode, token).subscribe(res => {
                if (res) {
                  this.router.navigate(['/get-token']);
                  this.gpioService.setMode(currentMode);
                  const mode = 'Server';
                  this.store.dispatch(set({mode}));
                  sessionStorage.setItem('state', mode);
                  this.checkState();
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
