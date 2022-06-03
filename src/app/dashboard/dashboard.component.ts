import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TradeFormComponent } from '../trade-form/trade-form.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public data: TradeData[] = [];
  displayedColumns: string[] = ['Entry date', 'Entry price', 'Exit date', 'Exit price', 'Profit', 'Action'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.columns = [
    //   { key: 'entry_date', title: 'Entry date' },
    //   { key: 'entry_price', title: 'Entry price' },
    //   { key: 'exit_date', title: 'Exit date' },
    //   { key: 'exit_price', title: 'Exit price' },
    //   { key: 'profit', title: 'Profit' },
    //   { key: 'action', title: 'Action' }
    // ];

    this.data = [];
  }

  openTradeForm(tradeData?: TradeData) {
    this.dialog.open(TradeFormComponent, {data: {...tradeData}})
  }

}

interface TradeData {
  entry_date: Date;
  exit_date: Date;
  entry_price: number;
  exit_price: number;
  profit: number;
  id: string;
}