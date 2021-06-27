import {Component, OnInit, ViewChild} from '@angular/core';
import {LocalConnectionService} from '../../../../Services/local-connection.service';
import {Router} from '@angular/router';


interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  btnClientState = false;
  btnServerState = false;
  mode: string;
  alert = true;
  constructor(
    private localCon: LocalConnectionService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  setMode(mode: string){
    if (mode === 'Server'){
      this.btnServerState = !this.btnServerState;
      this.btnClientState = false;
      this.localCon.CreateToken().subscribe( res => {
        const data = JSON.parse(res.toString());
        if (data.msg === 'ok') {
          console.log(true);
          this.localCon.SetMode(mode).subscribe(res => {
            this.router.navigate(['/get-token']);
            this.mode = mode;
          });
        }
        else {
          this.alert = false;
        }});
    }
    else{
      this.router.navigate(['connect']);
      this.btnClientState = !this.btnClientState;
      this.btnServerState = false;
      //this.localCon.SetMode(mode).subscribe();
      this.mode = mode;
    }
  }
}
