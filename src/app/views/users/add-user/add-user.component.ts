import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Functionality } from 'src/app/shared/models/functionalities.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  isCompleted: boolean;
  data: any = {
    email: ''
  };
  public infoAccessForm: FormGroup;
  public infoUserForm: FormGroup;
  public checkboxesForm: FormGroup;
  public submittedOne: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.infoAccessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.checkboxesForm = this.fb.group({
      casino: [false],
      aps: [false],
      clinic: [false],
      edMaterial: [false],
      nutrLabeling: [false],
    });

    this.infoUserForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern(/^[0-9]*$/)]],
      rut: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[0-9]+-[0-9kK]{1}|(((\d{2})|(\d{1})).\d{3}\.\d{3}-)([0-9kK]){1}$/), this.checkVerificatorDigit]],
      address: ['', Validators.required],
      registerNumber: ['', Validators.required]
    });
  }

  onSubmit(): void {

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


  get one() { return this.infoUserForm.controls; }

  get oneValue() { return this.infoUserForm.value; }

  get two() { return this.infoAccessForm.controls; }

  get twoValue() { return this.infoAccessForm.value; }

  get three() { return this.checkboxesForm.controls; }

  get threeValue() { return this.checkboxesForm.value; }

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

  onComplete(e) {
    let functionalities: Functionality = {
      aps: this.threeValue['aps'],
      casino: this.threeValue['casino'],
      clinic: this.threeValue['clinic'],
      edMaterial: this.threeValue['edMaterial'],
      nutrLabeling: this.threeValue['nutrLabeling'],
    };

    const user: User = {
      name: this.oneValue['name'],
      lastName: this.oneValue['lastName'],
      rut: this.oneValue['rut'],
      phone: this.oneValue['phone'],
      address: this.oneValue['address'],
      enabled: true,
      role: 'admin',
      createdAt: new Date(),
      email: this.twoValue['email'],
      permissions: ['read', 'write', 'delete'],
      functionalities: functionalities
    }

    console.log(user);


  }
}
