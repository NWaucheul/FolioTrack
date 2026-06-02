import { NgModule } from '@angular/core';
import { NativeScriptRouterModule, Routes } from '@nativescript/angular';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./stock-detail.component').then(m => m.StockDetailComponent)
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class StockDetailRoutingModule { }
