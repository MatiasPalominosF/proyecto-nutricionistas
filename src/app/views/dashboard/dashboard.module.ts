import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardV3Component } from './dashboard-v3/dashboard-v3.component';
import { DashboardV4Component } from './dashboard-v4/dashboard-v4.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    RouterModule.forChild(
      [
        {
          path: 'v1',
          component: DashboadDefaultComponent,
        },
        {
          path: 'v2',
          component: DashboardV2Component,
        },
        {
          path: 'v3',
          component: DashboardV3Component,
        },
        {
          path: 'v4',
          component: DashboardV4Component,
        },
      ]),
  ],
  declarations: [DashboadDefaultComponent, DashboardV2Component, DashboardV3Component, DashboardV4Component]
})
export class DashboardModule { }
