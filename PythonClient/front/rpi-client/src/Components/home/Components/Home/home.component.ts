import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../Services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'rpi-client';



  constructor(
    private http: HttpClient,

    private authService: AuthService ) {
  }

  async ngOnInit(): Promise<void>{

  }

}
