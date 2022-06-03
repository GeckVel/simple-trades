import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StoreService } from '../services/store.service';
import { TradeFormComponent } from '../trade-form/trade-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public data: TradeData[] = [];
  displayedColumns: string[] = ['Entry date', 'Exit date', 'Entry price', 'Exit price', 'Profit', 'Action'];
  dataSource: TradeData[] = [];
  subs?: Subscription;

  constructor(public dialog: MatDialog, private storeService: StoreService) {}

  ngOnInit(): void {
    this.subs = this.storeService.getOrderList().subscribe((data: TradeData[] | null) => {
      if (data) {
        this.dataSource = data;
      }
    })
  }

  openTradeForm(tradeData?: TradeData) {
    this.dialog.open(TradeFormComponent, {data: {...tradeData}})
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}

export interface TradeData {
  entry_date: Date;
  exit_date: Date;
  entry_price: number;
  exit_price: number;
  profit: number;
  id: string;
}