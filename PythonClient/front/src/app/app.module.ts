import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FlashMessagesModule} from 'flash-messages-angular';
import { HomeComponent } from '../Components/home/Components/Home/home.component';
import { GpioComponent } from '../Components/home/Components/gpio/gpio.component';
import {HomeRoutingModules} from '../Components/home/home-routing.modules';
import { TokenComponent } from '../Components/home/Components/token/token.component';
import { ConnectManagerComponent } from '../Components/home/Components/connect-manager/connect-manager.component';
import { ChangemodeComponent } from '../Components/home/Components/changemode/changemode.component';
import { ConnectedRpiComponent } from '../Components/home/Components/connected-rpi/connected-rpi.component';
import {TimeagoModule} from 'ngx-timeago';
import {StoreModule} from '@ngrx/store';
import {modeReducer} from '../Services/ModeState';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    TimeagoModule.forRoot(),
    StoreModule.forRoot({mode: modeReducer}),
    FlashMessagesModule.forRoot(),
    RouterModule.forRoot([
      {path: '', component: HomeComponent },
      {path: '**', component: HomeComponent, pathMatch: 'full'},
    ], { useHash: true }),
    HomeRoutingModules
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
