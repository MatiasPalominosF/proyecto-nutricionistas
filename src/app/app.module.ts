import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/spanish-paginator';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
