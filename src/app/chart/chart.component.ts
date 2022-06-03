import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { TradeData } from '../dashboard/dashboard.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  dataSource: any[] = [];
  options: any;
  xAxisData: string[] = [];
  subs?: Subscription;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.subs = this.storeService.getOrderList().subscribe((data: TradeData[] | null) => {
      if (data) {
        this.xAxisData = data.map(d => (d.exit_date.getDate()  + "." + (d.exit_date.getMonth()+1) + "." + d.exit_date.getFullYear()))
        this.dataSource = data.map(d => d.profit);

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
              name: 'Profit',
              type: 'line',
              data: this.dataSource
            }
          ],
          animationEasing: 'elasticOut'
        };
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
