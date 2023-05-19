import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation/navigation.service';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  private cypherText: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private encryptionService: EncryptionService,
  ) {
    this.auth.currentUser.subscribe(cypherText => {
      this.cypherText = cypherText;
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): false | Observable<boolean> {
    if (this.auth.getCurrentUser) {
      const user: User = this.encryptionService.decrypt(this.cypherText);
      return this.userService.getUserByUid(user.uid).pipe(
        map(data => {
          if (!data.enabled) {
            this.router.navigate(['others/404'], { queryParams: { returnUrl: state.url } });
            return false;
          }
          this.navigationService.publishNavigationChange(data.role);
          return true;
        })
      );
    };
    this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.auth.getCurrentUser) {
      return true;
    }
    this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
