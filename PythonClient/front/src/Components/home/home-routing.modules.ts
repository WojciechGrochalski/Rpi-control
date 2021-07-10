import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './Components/Home/home.component';
import {GpioComponent} from './Components/gpio/gpio.component';
import {TokenComponent} from './Components/token/token.component';
import {ConnectManagerComponent} from './Components/connect-manager/connect-manager.component';
import {ChangemodeComponent} from './Components/changemode/changemode.component';
import {ConnectedRpiComponent} from './Components/connected-rpi/connected-rpi.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
     children:
      [
        { path: 'gpio', component: GpioComponent},
        { path: 'get-token', component: TokenComponent},
        { path: 'connect', component: ConnectManagerComponent},
        { path: 'change-mode', component: ChangemodeComponent},
        { path: 'rpi', component: ConnectedRpiComponent}
      ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModules { }

