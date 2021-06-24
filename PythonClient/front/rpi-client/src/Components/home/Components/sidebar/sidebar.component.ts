import { Component, OnInit } from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  btnClientState = false;
  btnServerState = false;
  constructor(
    private localCon: LocalConnectionService
  ) { }

  ngOnInit(): void {
  }

  setMode(mode: string){

    if (mode === 'Server'){
     this.btnServerState = !this.btnServerState;
     this.btnClientState = false;
     this.localCon.SetMode(mode).subscribe();
    }
    else{
      this.btnClientState = !this.btnClientState;
      this.btnServerState = false;
      this.localCon.SetMode(mode).subscribe();
    }
  }
}
