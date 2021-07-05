import {Component, HostListener, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  constructor() {}
  @HostListener('window:onbeforeunload', ['$event'])
  clearLocalStorage(event): void{
    localStorage.clear();
  }
}
