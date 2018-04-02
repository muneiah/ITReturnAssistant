import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SodexoComponent } from './sodexo/sodexo.component';
import {ReturnsService} from './service/returns.service';
import { SavingsComponent } from './savings/savings.component';
import { HraComponent } from './hra/hra.component';
import { PreviewComponent } from './preview/preview.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DeclarationComponent } from './declaration/declaration.component';
import {HttpClientModule} from '@angular/common/http';
import { Declarationv2Component } from './declarationv2/declarationv2.component';


@NgModule({
  declarations: [
    AppComponent,
    InsuranceComponent,
    SodexoComponent,
    SavingsComponent,
    HraComponent,
    PreviewComponent,
    DeclarationComponent,
    Declarationv2Component
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ReturnsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
