import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StockDetailRoutingModule } from './stock-detail-routing.module';
import { StockDetailComponent } from './stock-detail.component';

@NgModule({
  declarations: [StockDetailComponent],
  imports: [
    NativeScriptCommonModule,
    StockDetailRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StockDetailModule { }
