import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store/local-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { User } from "../../models/user.interface";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  private authenticated: boolean;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private store: LocalStoreService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  checkAuth() {
    return this.authenticated = this.store.getItem("currentUser");
  }

  getuser() {
    return of({});
  }

  async doLogin(user: User) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  doRegister(user: User): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      // Validación de datos
      if (!user.email || !user.password) {
        reject(new Error('Faltan datos de usuario.'));
      }

      try {
        const authResult = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
        const userWithUid = {
          ...user,
          uid: authResult.user.uid,
          email: authResult.user.email,
        };
        resolve(userWithUid);
      } catch (error) {
        reject(error);
      }
    });
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

  async doLogout() {
    localStorage.removeItem('currentUser');
    try {
      await this.afAuth.signOut();
      this.router.navigateByUrl("/sessions/signin");
    } catch (error) {
      console.error("Error al cerrar sesión ", error);
    }
  }
}
