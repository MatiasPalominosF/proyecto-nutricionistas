import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/models/user.interface';
import isEqual from 'lodash/isEqual';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-functionalities-view',
  templateUrl: './functionalities-view.component.html',
  styleUrls: ['./functionalities-view.component.scss']
})
export class FunctionalitiesViewComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() user: User;

  public checkboxesForm: FormGroup;
  public isValidating: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.checkboxesForm = this.fb.group({
      casino: [this.user.functionalities.casino],
      aps: [this.user.functionalities.aps],
      clinic: [this.user.functionalities.clinic],
      edMaterial: [this.user.functionalities.edMaterial],
      nutrLabeling: [this.user.functionalities.nutrLabeling],
    });
  }

  get f() { return this.checkboxesForm.controls; }

  get fValue() { return this.checkboxesForm.value; }

  async onSubmit() {
    if (this.checkboxesForm.invalid) {
      return;
    }

    this.isValidating = true;

    if (!isEqual(this.fValue, this.user.functionalities)) {
      this.user.functionalities = { ...this.fValue };
      const result = await this.userService.updateUser(this.user);
      if (result) {
        console.info('Usuario actualizado');
        this.passEntry.emit(true);
        this.activeModal.close(true);
        this.isValidating = false;
      } else {
        console.error("Error al actualizar el usuario");
        this.isValidating = false;
      }
    } else {
      this.activeModal.dismiss('Nothing to update');
    }

  }
}
