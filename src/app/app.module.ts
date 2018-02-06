import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SodexoComponent } from './sodexo/sodexo.component';
import {ReturnsService} from "./service/returns.service";
import { SavingsComponent } from './savings/savings.component';
import { HraComponent } from './hra/hra.component';
import { PreviewComponent } from './preview/preview.component';


@NgModule({
  declarations: [
    AppComponent,
    InsuranceComponent,
    SodexoComponent,
    SavingsComponent,
    HraComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ReturnsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
