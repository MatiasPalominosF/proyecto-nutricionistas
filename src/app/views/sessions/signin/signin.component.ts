import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { LocalStoreService } from 'src/app/shared/services/local-store/local-store.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subscription, of } from 'rxjs';
import { EncryptionService } from 'src/app/shared/services/encryption/encryption.service';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit, OnDestroy {
    public loading: boolean;
    public loadingText: string;
    public signinForm: FormGroup;
    public submitted: boolean = false;
    private subscriptions: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private ls: LocalStoreService,
        private toastr: ToastrService,
        private userService: UserService,
        private encryptionService: EncryptionService,
    ) { }

    ngOnDestroy(): void {
        this.subscriptions.map(subscription => subscription.unsubscribe());
    }

    ngOnInit() {
        this.signinForm = this.fb.group({
            email: ['palominos90@gmail.com', Validators.required],
            password: ['Matias1996', Validators.required]
        });
        this.checkRouterEvent();
    }

    checkRouterEvent() {
        setTimeout(() => {
            this.router.events.subscribe(event => {
                if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                    this.loadingText = 'Cargando módulo dashboard...';
                    this.loading = true;
                }
                if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                    this.loading = false;
                }
            });
        }, 3000)
    }

    async signin() {
        this.loading = true;
        this.submitted = true;
        this.loadingText = 'Iniciando...';

        try {
            const res = await this.auth.doLogin(this.fValue);
            this.subscriptions.push(
                this.userService.getUserByUid(res.user.uid).subscribe(async (user) => {
                    const userEncrypted = this.encryptionService.encrypt(user);
                    this.ls.setItem('currentUser', userEncrypted);
                    this.router.navigateByUrl('/dashboard/v1');
                    this.loading = false;
                })
            );
        } catch (err) {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
                this.toastr.error('Correo o contraseña incorrecta', 'Inicio sesión', { timeOut: 3000, closeButton: true, progressBar: true })
            }
            this.loading = false;
        }
    }


    isAutenticated(): void {
        if (!this.ls.getItem('authenticated')) {
            return;
        }
        this.loading = true;
        this.loadingText = 'Iniciando...';
        this.router.navigateByUrl('/dashboard/v1');
        this.loading = false;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.signinForm.get(controlName).hasError(errorName);
    };

    get f() { return this.signinForm.controls; }

    get fValue() { return this.signinForm.value; }
}
