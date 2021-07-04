import { Component, OnInit } from '@angular/core';
import {JWT, LocalConnectionService} from '../../../../Services/local-connection.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  jwtToken: JWT;
  constructor(
    private get: LocalConnectionService ) { }

  async ngOnInit(): Promise<void> {
    this.jwtToken = await this.get.GetToken().toPromise();
  }
  copyInputMessage(inputElement): void{
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
