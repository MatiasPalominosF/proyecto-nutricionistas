import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  step2Form: FormGroup;
  public submittedOne: boolean = false;
  public infoUserForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.step2Form = this.fb.group({
      experience: [2]
    });

    this.infoUserForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      rut: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[0-9]+-[0-9kK]{1}|(((\d{2})|(\d{1})).\d{3}\.\d{3}-)([0-9kK]){1}$/), this.checkVerificatorDigit]],
      address: ['', Validators.required],
      registerNumber: ['', Validators.required]
    });
  }

  onSubmit(): void {

  }

  checkVerificatorDigit(control: AbstractControl) {
    let run = control;
    if (run.value == "") return null;

    //Limpiar run de puntos y guión
    var runClean = run.value.replace(/[^0-9kK]+/g, '').toUpperCase();

    // Aislar Cuerpo y Dígito Verificador
    let body = runClean.slice(0, -1);
    let dv = runClean.slice(-1).toUpperCase();

    // Calcular Dígito Verificador
    let suma = 0;
    let multiplo = 2;

    // Para cada dígito del Cuerpo
    for (let i = 1; i <= body.length; i++) {
      // Obtener su Producto con el Múltiplo Correspondiente
      let index = multiplo * runClean.charAt(body.length - i);
      // Sumar al Contador General
      suma = suma + index;
      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }

    // Calcular Dígito Verificador en base al Módulo 11
    let dvEsperado = 11 - (suma % 11);

    // Casos Especiales (0 y K)
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado != dv) {
      return { verificator: true };
    }
    else null;
  }

  checkRun() {
    let run = this.one['rut'];
    var runClean = run.value.replace(/[^0-9kK]+/g, '').toUpperCase();
    if (runClean.length <= 1) {
      return;
    }
    var result = runClean.slice(-4, -1) + "-" + runClean.substr(runClean.length - 1);
    for (var i = 4; i < runClean.length; i += 3) {
      result = runClean.slice(-3 - i, -i) + "." + result;
    }
    run.setValue(result);
  }

  get one() { return this.infoUserForm.controls; }

  get oneValue() { return this.infoUserForm.value; }

  public hasError = (controlName: string, errorName: string, form: FormGroup) => {
    return form.get(controlName).hasError(errorName);
  };


  onStep1Next(e) { }
  onStep2Next(e) { }
  onStep3Next(e) { }
  onComplete(e) { }
}
