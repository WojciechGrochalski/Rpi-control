import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Connect} from '../../../../Models/Connect';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-connect-manager',
  templateUrl: './connect-manager.component.html',
  styleUrls: ['./connect-manager.component.css']
})
export class ConnectManagerComponent implements OnInit {
  loading = false;
  submitted = false;
  connectForm: FormGroup;
  ipPattern = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';

  constructor(
    private formBuilder: FormBuilder,
    private localConn: LocalConnectionService,
    private router: Router,
    private flashMessagesService: FlashMessagesService ) {
  }

  ngOnInit(): void {
    this.connectForm = this.formBuilder.group({
      ip: ['', [Validators.required, Validators.pattern(this.ipPattern)]],
      port: ['', [Validators.required, Validators.maxLength(4)]],
      token: ['', [Validators.required]]
    });
  }

  get f() {
    return this.connectForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.connectForm.invalid) {
      return;
    }
    else {
      this.loading = true;
      const connect = new Connect(this.f.ip.value, this.f.port.value, this.f.token.value);
      this.localConn.ConnectToServer(connect).subscribe(res => {
          if (res) {
            this.router.navigate(['gpio']);
          } else {
            this.flashMessagesService.show('Nieprawidłowe dane', {cssClass: 'alert-danger', timeout: 3000});
            this.loading = false;
          }
        },
        error => {
          this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 3000});
          this.loading = false;
        });
    }
  }
}
