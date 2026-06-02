import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { Purchase } from '../../models/stock.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {
  ticker: string = '';
  purchases$: Observable<Purchase[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService
  ) {
    this.purchases$ = new Observable();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticker = params['id'];
      this.purchases$ = this.stockService.getPurchaseHistory(this.ticker);
    });
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }

  deletePurchase(purchaseId: string): void {
    this.stockService.deletePurchase(purchaseId).subscribe(() => {
      this.purchases$ = this.stockService.getPurchaseHistory(this.ticker);
    });
  }
}
