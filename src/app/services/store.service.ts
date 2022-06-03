import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TradeData } from '../dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private dataList$ = new BehaviorSubject<TradeData[]>([
  ]);
  private orderList: TradeData[] = [];

  constructor() { }

  getTradeOrder(id: string): TradeData | null {
    let tradeOrder = null;
    if (this.orderList?.length) {
      tradeOrder = this.orderList.find(t => t.id === id) || null;
    }

    return tradeOrder
  }

  getOrderList(): Observable<TradeData[] | null> {
    return this.dataList$.asObservable()
  }

  updateList(order: TradeData): void {
    this.orderList = this.orderList.filter(el => el.id !== order.id);
    this.orderList.push(order);
    this.dataList$.next(this.orderList);
  }

  pushOrder(newOrder: TradeData): void {
    this.orderList.push(newOrder);
    this.dataList$.next([...this.dataList$.getValue(), newOrder])
  }
}
