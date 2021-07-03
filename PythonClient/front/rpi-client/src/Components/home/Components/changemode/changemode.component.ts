import {Component, OnInit, Output,  EventEmitter } from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {GpioService} from '../../../../Services/gpio.service';

@Component({
  selector: 'app-changemode',
  templateUrl: './changemode.component.html',
  styleUrls: ['./changemode.component.css']
})
export class ChangemodeComponent implements OnInit {
  btnClientState = false;
  btnServerState = false;
  alert = true;
  constructor(
    private localCon: LocalConnectionService,
    private gpioService: GpioService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      this.gpioService.setMode(mode);
    }
  }
}
