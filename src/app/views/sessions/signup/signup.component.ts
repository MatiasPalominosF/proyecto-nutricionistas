import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { User } from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EncryptionService } from 'src/app/shared/services/encryption/encryption.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [SharedAnimations]
})
export class SignupComponent implements OnInit, OnDestroy {

  public registerForm: FormGroup;
  public submitted: boolean = false;
  private subscriptions: Subscription[] = [];
  public loading: boolean;
  public loadingText: string;
  private userLoggedIn: User = {};

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private encryptionService: EncryptionService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), this.matchPasswordValidator('password')]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[0-9]*$/)]],
      address: ['', Validators.required],
    });
    this.getCurrentUser();
    console.log(this.userLoggedIn);
  }
  matchPasswordValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = control.root.get(controlName);
      if (passwordControl && control.value !== passwordControl.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  getCurrentUser(): void {
    const userEncrypted: string = this.authService.getCurrentUser;
    this.userLoggedIn = this.encryptionService.decrypt(userEncrypted);
  }
  async tryRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = 'Registrando ...';
    const userUpdated: User = { ...this.userLoggedIn, ...this.fValue };

    this.afAuth.currentUser.then(user => {
      user.updatePassword(userUpdated.password)
        .then(
          async () => {
            delete userUpdated['password'];
            delete userUpdated['confirmPassword'];
            userUpdated.firstAccess = false;
            const result = await this.userService.updateUser(userUpdated);
            if (result) {
              this.toastr.success('Usuario actualizado correctamente', 'Finalizar registro', { timeOut: 3000, closeButton: true, progressBar: true });
              this.authService.doLogout();
              this.loading = false;
            } else {
              this.toastr.error('Error al actualizar el usuario', 'Finalizar registro', { timeOut: 3000, closeButton: true, progressBar: true });
              this.loading = false;
            }
          }
        ).catch((error) => {
          console.error(error);
          this.loading = false;
        });
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName).hasError(errorName);
  };

  get f() { return this.registerForm.controls; }

  get fValue() { return this.registerForm.value; }

}
