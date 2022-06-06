import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { TradeData } from '../models/trade-data.interface';
import { Subscription } from 'rxjs';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  dataSource: number[] = [];
  options?: EChartsOption;
  xAxisData: string[] = [];
  subs?: Subscription;

  constructor(private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.subs = this.storeService.getOrderList().subscribe((data: TradeData[] | null) => {
      if (data) {
        this.xAxisData = data.map(d => (d.exit_date.getDate()  + "." + (d.exit_date.getMonth()+1) + "." + d.exit_date.getFullYear()))
        this.dataSource = this.calculateBalance(data);

        this.options = {
          legend: {
            data: ['bar'],
            align: 'left',
          },
          tooltip: {},
          xAxis: {
            data: this.xAxisData,
            silent: false,
            splitLine: {
              show: false,
            },
          },
          yAxis: {},
          series: [
            {
              name: 'Balance',
              type: 'line',
              data: this.dataSource
            }
          ],
          animationEasing: 'elasticOut'
        };
      }
    });
  }

  calculateBalance(data: TradeData[]): number[] {
    const sortData = data.sort((a, b) => a.exit_date.getTime() - b.exit_date.getTime())
    let sum: number;
    const balanceChartData = sortData.map(d => sum = (sum || 0) + d.profit);
    return balanceChartData
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
