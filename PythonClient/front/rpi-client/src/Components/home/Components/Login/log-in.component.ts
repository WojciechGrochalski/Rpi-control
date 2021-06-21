import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FlashMessagesService} from 'flash-messages-angular';
import {AuthService} from '../../../../Services/auth.service';
import {AuthModel} from '../../../../Models/AuthModel';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {


  ////
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  @Input() public disabled: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService) {

    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    try {
      const message = this.route.snapshot.paramMap.get('confirm');
      if (message) {
        this.flashMessagesService.show(message, {cssClass: 'alert-success', timeout: 5000});
      }
    } catch (e) {
      console.error(e);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const user = new AuthModel(this.f.username.value, this.f.password.value);
    this.loading = true;
    this.authService.login(user)
      .subscribe(res => {
          if (res) {
            this.router.navigate([this.returnUrl]);
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
