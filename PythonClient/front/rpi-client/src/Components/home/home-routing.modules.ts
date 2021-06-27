import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './Components/Home/home.component';
import {LogInComponent} from './Components/Login/log-in.component';
import {GpioComponent} from './Components/gpio/gpio.component';
import {TokenComponent} from './Components/token/token.component';
import {ConnectManagerComponent} from './Components/connect-manager/connect-manager.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
     children:
      [
        { path: 'login', component: LogInComponent},
        { path: 'gpio', component: GpioComponent},
        { path: 'get-token', component: TokenComponent},
        { path: 'connect', component: ConnectManagerComponent}
      ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModules { }

