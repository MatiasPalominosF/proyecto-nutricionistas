import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { LocalStoreService } from 'src/app/shared/services/local-store/local-store.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subscription } from 'rxjs';

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
    ) { }

    ngOnDestroy(): void {
        this.subscriptions.map(subscription => subscription.unsubscribe());
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Cargando módulo dashboard...';
                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        this.signinForm = this.fb.group({
            email: ['palominos90@gmail.com', Validators.required],
            password: ['Matias1996', Validators.required]
        });
    }

    async signin() {
        this.loading = true;
        this.submitted = true;
        this.loadingText = 'Iniciando...';

        try {
            const res = await this.auth.doLogin(this.fValue);
            this.subscriptions.push(
                this.userService.getUserByUid(res.user.uid).subscribe(async (user) => {
                    this.ls.setItem('currentUser', user);
                    this.router.navigateByUrl('/dashboard/v1');
                    this.loading = false;
                })
            );
        } catch (err) {
            this.toastr.error('Error al iniciar sesión', 'Inicio sesión', { timeOut: 3000, closeButton: true, progressBar: true })
        }
    }


    isAutenticated(): void {
        if (!this.ls.getItem('authenticated')) {
            return;
        }
        this.loading = true;
        this.loadingText = 'Sigining in...';
        this.router.navigateByUrl('/dashboard/v1');
        this.loading = false;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.signinForm.get(controlName).hasError(errorName);
    };

    get f() { return this.signinForm.controls; }

    get fValue() { return this.signinForm.value; }
}
