import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LogInComponent} from '../Components/home/Components/Login/log-in.component';
import {HttpInterceptorService} from '../Services/http-interceptor.service';
import {ErrorInterceptorService} from '../Services/error-interceptor.service';
import {RouterModule} from '@angular/router';
import {FlashMessagesModule} from 'flash-messages-angular';
import { HomeComponent } from '../Components/home/Components/Home/home.component';
import { SidebarComponent } from '../Components/home/Components/sidebar/sidebar.component';
import { GpioComponent } from '../Components/home/Components/gpio/gpio.component';
import {HomeRoutingModules} from '../Components/home/home-routing.modules';
import { TokenComponent } from '../Components/home/Components/token/token.component';
import { ConnectManagerComponent } from '../Components/home/Components/connect-manager/connect-manager.component';
import { ChangemodeComponent } from '../Components/home/Components/changemode/changemode.component';
import { ConnectedRpiComponent } from '../Components/home/Components/connected-rpi/connected-rpi.component';




@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    SidebarComponent,
    GpioComponent,
    TokenComponent,
    ConnectManagerComponent,
    ChangemodeComponent,
    ConnectedRpiComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: '**', component: HomeComponent, pathMatch: 'full'},
      { path: 'login/:confirm', component: LogInComponent},
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
