import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
    ]
})
export class MaterialComponentsModule { }
