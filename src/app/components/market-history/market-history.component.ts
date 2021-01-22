import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { first } from 'rxjs/operators'
import { MarketHistoryI } from 'src/app/models/coin-gecko-api.model'
import { CoinGeckoApiService } from 'src/app/services/coin-gecko-api.service'
// import { ChartDataSets, ChartOptions } from 'chart.js'
// import { Color, Label } from 'ng2-charts'

// import * as dayjs from 'dayjs'

@Component({
  selector: 'app-market-history',
  templateUrl: './market-history.component.html',
  styleUrls: ['./market-history.component.scss']
})
export class MarketHistoryComponent implements OnInit, OnChanges {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  @Input() coinName: string
  @Input() vsCurrency: string

  rawMarketData$ = new BehaviorSubject<MarketHistoryI>({} as MarketHistoryI)

  // WORKING HERE
  // lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  // ]
  // lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  // // lineChartOptions: (ChartOptions & { annotation: any }) = {
  // //   responsive: true,
  // // }
  // lineChartColors: Color[] = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //   },
  // ]
  // lineChartLegend = true
  // lineChartType = 'line'
  // lineChartPlugins = []

  constructor(private currencyService: CoinGeckoApiService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
    this.populateChartData()
  }

  populateChartData(): void {
    const coinName = this.coinName.toLowerCase()
    const vsCurrency = this.vsCurrency.toLowerCase()
    const days = 30
    this.currencyService.getMarketHistory(coinName, vsCurrency, days)
      .pipe(first()).subscribe(marketData => {
        this.rawMarketData$.next(marketData)
        this.formatChartData(marketData)
      })
  }

  formatChartData(marketData: MarketHistoryI): void {
    console.log('format chart data', marketData)
  }
  // WORKING HERE :: dev market history chart
  // resources =>
  // https://stackblitz.com/edit/ng2-charts-line-template
  // https://www.chartjs.org/docs/latest/charts/line.html
  // https://valor-software.com/ng2-charts/
  // https://github.com/valor-software/ng2-charts
}
