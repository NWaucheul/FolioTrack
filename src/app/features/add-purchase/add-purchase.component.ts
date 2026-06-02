import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  ticker: string = '';
  quantity: number = 0;
  purchasePrice: number = 0;
  averagePrice: number = 0;
  totalCost: number = 0;

  constructor(private stockService: StockService, private router: Router) { }

  ngOnInit(): void {
  }

  onTickerChange(): void {
    if (this.ticker) {
      this.stockService.getPurchaseHistory(this.ticker).subscribe(purchases => {
        if (purchases.length > 0) {
          const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
          const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
          this.averagePrice = totalCost / totalQuantity;
        } else {
          this.averagePrice = 0;
        }
      });
    }
  }

  get totalCost(): number {
    return this.quantity * this.purchasePrice;
  }

  addPurchase(): void {
    if (this.ticker && this.quantity && this.purchasePrice) {
      this.stockService.addPurchase(this.ticker, this.quantity, this.purchasePrice).subscribe(
        () => {
          this.router.navigate(['/portfolio']);
        },
        (error) => {
          console.error('Error adding purchase:', error);
          alert('Error adding purchase. Please try again.');
        }
      );
    } else {
      alert('Please fill in all fields');
    }
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }
}
