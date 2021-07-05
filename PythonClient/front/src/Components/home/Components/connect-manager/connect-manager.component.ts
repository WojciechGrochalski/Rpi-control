import {AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Connect} from '../../../../Models/Connect';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
import {GpioService} from '../../../../Services/gpio.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-connect-manager',
  templateUrl: './connect-manager.component.html',
  styleUrls: ['./connect-manager.component.css']
})
export class ConnectManagerComponent implements OnInit, OnDestroy {
  loading = false;
  submitted = false;
  connectForm: FormGroup;
  disconnectForm: FormGroup;
  ipPattern = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
  mode = '';
  subscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private localConn: LocalConnectionService,
    private router: Router,
    private gpioService: GpioService,
    private conn: LocalConnectionService,
    private flashMessagesService: FlashMessagesService ) {
  }

  ngOnInit(): void {
    this.subscription = this.gpioService.getMode().subscribe(newMode => {
      this.mode = newMode;
      localStorage.setItem('mode', this.mode);
      console.log(this.mode);
    });
    console.log(this.mode, 'mode');
    if ( this.mode === ''){
      this.mode = localStorage.getItem('mode').toString();
      console.log(this.mode, 'mode');
    }
    this.connectForm = this.formBuilder.group({
      ip: ['', [Validators.required, Validators.pattern(this.ipPattern)]],
      port: ['', [Validators.required, Validators.maxLength(4)]],
      token: ['', [Validators.required]]
    });
    this.disconnectForm = this.formBuilder.group({
      port: ['', [Validators.required, Validators.maxLength(4)]],
    });



  }


  get f() {
    return this.connectForm.controls;
  }
  get d() {
    return this.disconnectForm.controls;
  }

  Disconnect(): void {
    this.submitted = true;
    if (this.disconnectForm.invalid) {
      console.log('invalid');
      return;
    }
    else {

      this.loading = true;
      this.conn.DisconnectFromServer(this.d.port.value).subscribe(res => {
          if (res === 'disconnected') {
            this.gpioService.setMode('');
            this.loading = false;
            this.router.navigate(['change-mode']);
          }
        },
        error => {
          this.loading = false;
          this.flashMessagesService.show('Something goes wrong. Try again', {cssClass: 'alert-danger', timeout: 3000});

        });
    }


  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.connectForm.invalid) {
      return;
    }
    else {
      this.loading = true;
      const ip = this.f.ip.value;
      const connect = new Connect(this.f.ip.value, this.f.port.value, this.f.token.value);
      this.localConn.ConnectToServer(connect).subscribe(res => {
          if (res) {
            this.gpioService.setMode('Client');
            this.router.navigate(['gpio']);
          } else {
            this.flashMessagesService.show('Nieprawidłowe dane', {cssClass: 'alert-danger', timeout: 3000});
            this.loading = false;
          }
        },
        error => {
          this.flashMessagesService.show('Cannot connect to server on ip ' + ip, {cssClass: 'alert-danger', timeout: 3000});
          this.loading = false;
        });
    }
  }

  ngOnDestroy(): void {
     this.subscription.unsubscribe();
  }
}
