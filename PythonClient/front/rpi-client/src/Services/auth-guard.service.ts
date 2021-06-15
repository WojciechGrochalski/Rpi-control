import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  message = 'Twoja sesja wygasła, zaloguj się ponownie';

  constructor(
    public auth: AuthService,
    private router: Router) {
  }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login/' + this.message]);
      return false;
    }
    return true;
  }
}
