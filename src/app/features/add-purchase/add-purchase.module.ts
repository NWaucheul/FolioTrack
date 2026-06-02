import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AddPurchaseRoutingModule } from './add-purchase-routing.module';
import { AddPurchaseComponent } from './add-purchase.component';

@NgModule({
  declarations: [AddPurchaseComponent],
  imports: [
    NativeScriptCommonModule,
    AddPurchaseRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AddPurchaseModule { }
