import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private encryptionService: EncryptionService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userEncrypted: string = this.authService.getCurrentUser;
    const user: User = this.encryptionService.decrypt(userEncrypted);
    if (user.firstAccess && user.role === 'admin') {
      this.router.navigate(['/sessions/signup'], { queryParams: { returnUrl: state.url } });
    }
    return true;
  }

}
