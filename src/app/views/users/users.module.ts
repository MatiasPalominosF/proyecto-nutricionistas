import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersViewComponent } from './users-view/users-view.component';
import { RouterModule } from '@angular/router';
import { MaterialComponentsModule } from 'src/app/shared/material-components.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { AddUserComponent } from './add-user/add-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsersViewComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FormWizardModule,
    MaterialComponentsModule,
    SharedComponentsModule,
    RouterModule.forChild(
      [
        {
          path: 'users-view',
          component: UsersViewComponent,
        }
      ]),
  ]
})
export class UsersModule { }
