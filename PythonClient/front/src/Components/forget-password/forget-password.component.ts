import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {FlashMessagesService} from 'flash-messages-angular';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private flashMessagesService: FlashMessagesService) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Email: ['', Validators.required],
    });
  }


  get f() {
    return this.registerForm.controls;
  }

  onSubmit(email: string) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.ResetPassword(email)
      .subscribe(
        data => {
          this.router.navigate(['/login/' + data.message]);
        },
        error => {
          this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 5000});
          this.loading = false;
        });
  }
}



