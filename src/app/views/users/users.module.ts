import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersViewComponent } from './users-view/users-view.component';
import { RouterModule } from '@angular/router';
import { MaterialComponentsModule } from 'src/app/shared/material-components.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { AddUserComponent } from './add-user/add-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    UsersViewComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
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
