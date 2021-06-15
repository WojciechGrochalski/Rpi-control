import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {UserService} from '../../Services/User.service';
import {NewPassword} from '../../Models/NewPassword';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  email: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private flashMessagesService: FlashMessagesService) {

  }

  ngOnInit() {

    const token = this.route.snapshot.queryParamMap.get('token');
    this.userService.VerifyPasswordToken(token).subscribe(res => {
        this.email = res.email;

      },
      error => {
        this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 3000});
      });
    this.resetPasswordForm = this.formBuilder.group({
      Pass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get p() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(password: string) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    const newPassword = new NewPassword(password, this.email);
    this.authService.SetNewPassword(newPassword)
      .subscribe(
        data => {
          this.router.navigate(['/login/' + data.message]);
        },
        error => {
          this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 3000});
          this.loading = false;
        });
  }
}

