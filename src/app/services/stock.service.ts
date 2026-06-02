import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface Purchase {
  id: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  totalCost: number;
}

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  currentPrice: number;
}

export interface PortfolioItem {
  stock: Stock;
  purchases: Purchase[];
  totalQuantity: number;
  averageCost: number;
  totalCost: number;
  currentValue: number;
  yield: number;
  yieldPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://api.example.com';
  private portfolioSubject = new BehaviorSubject<PortfolioItem[]>([]);
  public portfolio$ = this.portfolioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.http.get<Purchase[]>(`${this.apiUrl}/purchases`).pipe(
      map(purchases => this.groupPurchases(purchases)),
      tap(portfolio => this.portfolioSubject.next(portfolio)),
      catchError(error => {
        console.error('Error loading portfolio:', error);
        return of([]);
      })
    ).subscribe();
  }

  private groupPurchases(purchases: Purchase[]): PortfolioItem[] {
    const grouped: { [key: string]: Purchase[] } = {};
    purchases.forEach(p => {
      if (!grouped[p.ticker]) {
        grouped[p.ticker] = [];
      }
      grouped[p.ticker].push(p);
    });

    return Object.keys(grouped).map(ticker => this.createPortfolioItem(ticker, grouped[ticker]));
  }

  private createPortfolioItem(ticker: string, purchases: Purchase[]): PortfolioItem {
    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
    const averageCost = totalCost / totalQuantity;
    const currentPrice = 100;
    const currentValue = totalQuantity * currentPrice;
    const yield_ = currentValue - totalCost;
    const yieldPercentage = (yield_ / totalCost) * 100;

    return {
      stock: {
        id: ticker,
        ticker: ticker,
        name: ticker,
        currentPrice: currentPrice
      },
      purchases: purchases,
      totalQuantity: totalQuantity,
      averageCost: averageCost,
      totalCost: totalCost,
      currentValue: currentValue,
      yield: yield_,
      yieldPercentage: yieldPercentage
    };
  }

  addPurchase(ticker: string, quantity: number, purchasePrice: number): Observable<any> {
    const purchase: Purchase = {
      id: Date.now().toString(),
      ticker: ticker,
      quantity: quantity,
      purchasePrice: purchasePrice,
      purchaseDate: new Date(),
      totalCost: quantity * purchasePrice
    };

    return this.http.post(`${this.apiUrl}/purchases`, purchase).pipe(
      tap(() => this.loadPortfolio()),
      catchError(error => {
        console.error('Error adding purchase:', error);
        throw error;
      })
    );
  }

  getPurchaseHistory(ticker: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/purchases?ticker=${ticker}`).pipe(
      catchError(error => {
        console.error('Error fetching purchase history:', error);
        return of([]);
      })
    );
  }

  deletePurchase(stockId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/stocks/${stockId}`).pipe(
      tap(() => this.loadPortfolio()),
      catchError(error => {
        console.error('Error deleting purchase:', error);
        throw error;
      })
    );
  }

  getCurrentStockPrice(ticker: string): Observable<number> {
    return this.http.get<{ price: number }>(`${this.apiUrl}/stocks/${ticker}/price`).pipe(
      map(response => response.price),
      catchError(error => {
        console.error('Error fetching stock price:', error);
        return of(0);
      })
    );
  }
}
