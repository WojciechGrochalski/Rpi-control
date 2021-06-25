import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgetPasswordComponent} from '../Components/forget-password/forget-password.component';
import {RegisterComponent} from '../Components/register/register.component';
import {LogInComponent} from '../Components/home/Components/Login/log-in.component';
import {VerifyUserComponent} from '../Components/verify-user/verify-user.component';
import {NewPasswordComponent} from '../Components/new-password/new-password.component';
import {HttpInterceptorService} from '../Services/http-interceptor.service';
import {ErrorInterceptorService} from '../Services/error-interceptor.service';
import {RouterModule} from '@angular/router';
import {FlashMessagesModule} from 'flash-messages-angular';
import { HomeComponent } from '../Components/home/Components/Home/home.component';
import { SidebarComponent } from '../Components/home/Components/sidebar/sidebar.component';
import { GpioComponent } from '../Components/home/Components/gpio/gpio.component';
import {HomeRoutingModules} from '../Components/home/home-routing.modules';
import { TokenComponent } from '../Components/home/Components/token/token.component';




@NgModule({
  declarations: [
    AppComponent,
    ForgetPasswordComponent,
    LogInComponent,
    RegisterComponent,
    VerifyUserComponent,
    NewPasswordComponent,
    HomeComponent,
    SidebarComponent,
    GpioComponent,
    TokenComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'login', component: LogInComponent},
      { path: 'gpio', component: GpioComponent},
      { path: 'login/:confirm', component: LogInComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'new-password', component: NewPasswordComponent},
      { path: 'forgot-password', component: ForgetPasswordComponent},
    ]),
    HomeRoutingModules
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
