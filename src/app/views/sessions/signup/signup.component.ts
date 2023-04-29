import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { User } from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      rut: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async tryRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.loadingText = 'Registrando ...';
    let user: User = {
      ...this.fValue,
      email: this.fValue.email.replace(/\s/g, "").toLowerCase(),
      createdAt: new Date(),
      enabled: true,
      lastActivity: new Date(),
      role: 'superadmin',
      permissions: ['read', 'write', 'update', 'delete'],
      phone: '89189474',
      address: 'Población Mataquito pasaje 3 #105',
    };

    await this.authService.doRegister(user)
      .then(data => {
        delete data['password'];
        this.userService.createUser(data)
          .then(() => {
            console.info('Usuario creado');
            this.toastr.success('Usuario creado', 'Registrar', { timeOut: 3000, closeButton: true, progressBar: true });
            this.router.navigateByUrl('/sessions/signin');
            this.loading = false;
          })
          .catch(error => {
            console.error("Error al crear el usuario ", error);
            this.loading = false;
            this.loadingText = 'Reintentar registro';
          })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.toastr.error('Correo ya registrado', 'Registrar', { timeOut: 3000, closeButton: true, progressBar: true })
        } else {
          console.error("Error ", error);
        }
        this.loading = false;
      })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName).hasError(errorName);
  };

  get f() { return this.registerForm.controls; }

  get fValue() { return this.registerForm.value; }

}
