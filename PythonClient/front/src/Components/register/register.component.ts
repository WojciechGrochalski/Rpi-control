import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../Services/auth.service';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private authService: AuthService,
               private flashMessagesService: FlashMessagesService ) {

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Pass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
    get f() { return this.registerForm.controls; }

    onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
        return;
      }

      this.loading = true;
      this.authService.Register(this.registerForm.value)
        .subscribe(
          data => {
            this.router.navigate(['/login/' + data.message]);
          },
          error => {
            this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 5000})
            this.loading = false;
          });
    }
  }



