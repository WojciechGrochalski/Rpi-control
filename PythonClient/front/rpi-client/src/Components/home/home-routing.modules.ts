import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './Components/Home/home.component';
import {LogInComponent} from './Components/Login/log-in.component';
import {GpioComponent} from './Components/gpio/gpio.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
     children:
      [
        { path: 'login', component: LogInComponent},
        { path: 'gpio', component: GpioComponent}
      ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModules { }

