import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  private authenticated: boolean;

  constructor(private store: LocalStoreService, private router: Router) {
    this.checkAuth();
  }

  checkAuth() {
    return this.authenticated = this.store.getItem("authenticated");
  }

  getuser() {
    return of({});
  }

  signin(credentials) {
    this.authenticated = true;
    this.store.setItem("authenticated", true);
    return of({}).pipe(delay(1500));
  }
  signout() {
    this.authenticated = false;
    this.store.setItem("authenticated", false);
    this.router.navigateByUrl("/sessions/signin");
  }
}
