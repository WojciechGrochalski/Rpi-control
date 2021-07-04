import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../Services/User.service';
import {FlashMessagesService} from 'flash-messages-angular';


@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private flashMessagesService: FlashMessagesService) {
  }

  ngOnInit() {

    const token = this.route.snapshot.queryParamMap.get('token');

    this.userService.VerifyUser(token).subscribe(res => {
        this.flashMessagesService.show(res.message, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/user-profile']);
      },
      error => {
        this.flashMessagesService.show(error.error.message, {cssClass: 'alert-danger', timeout: 3000});
      });
  }

}
