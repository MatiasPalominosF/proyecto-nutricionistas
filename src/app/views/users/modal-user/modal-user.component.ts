import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Functionality } from 'src/app/shared/models/functionalities.interface';
import { User } from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EmailService } from 'src/app/shared/services/email/email.service';
import { EncryptionService } from 'src/app/shared/services/encryption/encryption.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() typeModal: Boolean; // true is for add, false for edit
  @Input() userEdit?: User;

  public infoAccessForm: FormGroup;
  public infoUserForm: FormGroup;
  public checkboxesForm: FormGroup;
  public submittedOne: boolean = false;
  private _isValidating: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.infoAccessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.infoUserForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^[0-9]*$/)]],
      rut: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[0-9]+-[0-9kK]{1}|(((\d{2})|(\d{1})).\d{3}\.\d{3}-)([0-9kK]){1}$/), this.checkVerificatorDigit]],
      address: ['', Validators.required],
      registerNumber: ['', Validators.required]
    });

    this.checkboxesForm = this.fb.group({
      casino: [false],
      aps: [false],
      clinic: [false],
      edMaterial: [false],
      nutrLabeling: [false],
    });

    if (!this.typeModal) {
      this.getData();
    }
  }

  getData() {
    this.two['email'].setValue(this.userEdit.email);
    this.one['name'].setValue(this.userEdit.name);
    this.one['lastName'].setValue(this.userEdit.lastName);
    this.one['phone'].setValue(this.userEdit.phone);
    this.one['rut'].setValue(this.userEdit.rut);
    this.one['address'].setValue(this.userEdit.address);
    this.one['registerNumber'].setValue(this.userEdit.registerNumber);
    this.three['casino'].setValue(this.userEdit.functionalities.casino);
    this.three['aps'].setValue(this.userEdit.functionalities.aps);
    this.three['clinic'].setValue(this.userEdit.functionalities.clinic);
    this.three['edMaterial'].setValue(this.userEdit.functionalities.edMaterial);
    this.three['nutrLabeling'].setValue(this.userEdit.functionalities.nutrLabeling);
  }

  get one() { return this.infoUserForm.controls; }

  get oneValue() { return this.infoUserForm.value; }

  get two() { return this.infoAccessForm.controls; }

  get twoValue() { return this.infoAccessForm.value; }

  get three() { return this.checkboxesForm.controls; }

  get threeValue() { return this.checkboxesForm.value; }

  get userLogged() {
    return this.encryptionService.decrypt(this.authService.getCurrentUser) as User;
  }

  get isCompleted(): boolean {
    return this._isValidating;
  }

  get isValidating(): boolean {
    return this._isValidating;
  }

  checkVerificatorDigit(control: AbstractControl) {
    const runClean = control.value.replace(/[^0-9kK]+/g, '').toUpperCase();
    if (!runClean) {
      return null;
    }

    const [body, dv] = [runClean.slice(0, -1), runClean.slice(-1).toUpperCase()];
    let suma = 0;
    let multiplo = 2;

    for (let i = 1; i <= body.length; i++) {
      const index = multiplo * runClean.charAt(body.length - i);
      suma += index;
      multiplo = (multiplo < 7) ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado = (dvEsperado === 11) ? 0 : dvEsperado;
    const parsedDv = isNaN(+dv) ? (dv === 'K' ? 10 : -1) : +dv;

    if (dvEsperado !== parsedDv) {
      return { verificator: true };
    } else {
      return null;
    }
  }


  checkRun() {
    const run = this.one['rut'];
    let runClean = run.value.replace(/[^0-9kK]+/g, '').toUpperCase();
    if (runClean.length <= 1) {
      return;
    }
    const dv = runClean.slice(-1);
    const body = runClean.slice(0, -1);
    const formattedBody = body.replace(/(\d)(?=(\d{3})+$)/g, '$1.');

    run.setValue(`${formattedBody}-${dv}`);
  }

  public hasError = (controlName: string, errorName: string, form: FormGroup) => {
    return form.get(controlName).hasError(errorName);
  };


  onStep1Next(e) {
    if (this.infoUserForm.invalid) {
      return;
    }
  }
  onStep2Next(e) {
    if (this.infoAccessForm.invalid) {
      return;
    }
  }
  async onStep3Next(e) {
    if (this.infoAccessForm.invalid) {
      return;
    }

    this._isValidating = true;
    const functionalities: Functionality = { ... this.threeValue };
    const password = this.encryptionService.generateRandom(8);
    const user: User = {
      ...this.oneValue,
      ...this.twoValue,
      functionalities: functionalities,
      password: password,
      enabled: true,
      role: 'admin',
      createdAt: new Date(),
    };

    if (!this.typeModal) {
      delete user['password']
      user.createdAt = this.userEdit.createdAt;
      user.uid = this.userEdit.uid;
      if (!isEqual(user, this.userEdit)) {
        //que actualice
        const result = await this.userService.updateUser(user);
        if (result) {
          console.info('Usuario editado');
          this.passEntry.emit(true);
          this.activeModal.close(true);
          this._isValidating = false;
        }
      } else {
        this.activeModal.dismiss('Nothing to update');
      }
    } else {
      await this.authService.doRegister(user).then(data => {
        const message = 'test';
        const url = "www.nutricionistas.websavvy.cl";
        this.emailService.sendEmail(data, message, url).subscribe(
          response => {
            console.info("Correo enviado");
            this.toastr.info('Correo enviado', 'Correo', { timeOut: 3000, closeButton: true, progressBar: true });
          },
          error => {
            console.log("Error al enviar el correo ", error);
            this.toastr.error('Error al enviar el correo', 'Correo', { timeOut: 3000, closeButton: true, progressBar: true });
          }

        );
        delete data['password'];
        this.userService.createUser(data)
          .then(() => {
            console.info('Usuario creado');
            this.passEntry.emit(true);
            this.activeModal.close(true);
            this._isValidating = false;
          })
          .catch(error => {
            console.error("Error al crear el usuario ", error);
            this.toastr.error('Error al crear el usuario', 'Registrar', { timeOut: 3000, closeButton: true, progressBar: true });
            this._isValidating = false;
          })
      })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            this.toastr.error('Correo ya registrado', 'Registrar', { timeOut: 3000, closeButton: true, progressBar: true })
            this._isValidating = false;
          } else {
            console.error("Error ", error);
          }
        })
    }
  }


}
