import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SodexoComponent } from './sodexo/sodexo.component';
import {ReturnsService} from "./service/returns.service";
import { SavingsComponent } from './savings/savings.component';
import { HraComponent } from './hra/hra.component';
import { PreviewComponent } from './preview/preview.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DeclarationComponent } from './declaration/declaration.component';

@NgModule({
  declarations: [
    AppComponent,
    InsuranceComponent,
    SodexoComponent,
    SavingsComponent,
    HraComponent,
    PreviewComponent,
    DeclarationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [ReturnsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
