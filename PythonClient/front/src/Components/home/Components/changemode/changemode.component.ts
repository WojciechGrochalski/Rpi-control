import {Component, OnInit, OnDestroy} from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {GpioService} from '../../../../Services/gpio.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-changemode',
  templateUrl: './changemode.component.html',
  styleUrls: ['./changemode.component.css']
})
export class ChangemodeComponent implements OnInit, OnDestroy {
  btnClientState = false;
  btnServerState = false;
  alert = true;
  subscription: Subscription;
  mode = '';
  constructor(
    private localCon: LocalConnectionService,
    private gpioService: GpioService,
    private router: Router
  ) {
      if (this.mode === null || this.mode === ''){
      if (localStorage.getItem('mode')){
        this.mode = localStorage.getItem('mode').toString() ;
      }
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
  }

  shutdown(): void{
    this.localCon.ShutDownServer().subscribe( res =>{
      if (res)
      {
        this.mode = null;
        this.gpioService.setMode('');
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
