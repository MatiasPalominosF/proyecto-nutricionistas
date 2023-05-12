import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store/local-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { User } from "../../models/user.interface";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { EncryptionService } from "../encryption/encryption.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  private authenticated: boolean;
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private ls: LocalStoreService
  ) {
    this.currentUserSubject = new BehaviorSubject<string>(this.ls.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public set setCurrentUser(userEncrypted: string) {
    this.ls.setItem('currentUser', userEncrypted);
    this.currentUserSubject.next(userEncrypted);
  }

  public get getCurrentUser(): string {
    return this.currentUserSubject.value;
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
  async doLogout() {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('currentUser');
      this.router.navigateByUrl("/sessions/signin");
    } catch (error) {
      console.error("Error al cerrar sesión ", error);
    }
  }
}
