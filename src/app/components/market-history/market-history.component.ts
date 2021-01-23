import { Component, Input, OnChanges } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { first } from 'rxjs/operators'
import { MarketHistoryI, MarketHistorySeries } from 'src/app/models/coin-gecko-api.model'
import { CoinGeckoApiService } from 'src/app/services/coin-gecko-api.service'
import { ChartDataSets, ChartOptions } from 'chart.js'
import { Color, Label } from 'ng2-charts'
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-market-history',
  templateUrl: './market-history.component.html',
  styleUrls: ['./market-history.component.scss']
})
export class MarketHistoryComponent implements OnChanges {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  @Input() coinId: string
  @Input() vsCurrency: string

  rawMarketData$ = new BehaviorSubject<MarketHistoryI>({} as MarketHistoryI)

  lineChartData: ChartDataSets[]
  lineChartLabels: Label[]
  lineChartOptions: ChartOptions = { responsive: true }
  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(255, 0, 0)'
    },
    {
      borderColor: 'rgba(0, 0, 255)'
    },
    {
      borderColor: 'rgba(255, 165, 0)'
    }
  ]

  historicalRanges = [
    { value: 30, display: '1 month' },
    { value: 90, display: '3 months' },
    { value: 180, display: '6 months' },
    { value: 365, display: '1 year' },
    { value: 'max', display: 'Max' }
  ]
  historicalRange = this.historicalRanges[0] // initial/default value

  constructor(private currencyService: CoinGeckoApiService) {}

  ngOnChanges(): void {
    this.populateChartData()
  }

  populateChartData(): void {
    const coinName = this.coinId
    const vsCurrency = this.vsCurrency
    const days = this.historicalRange.value
    this.currencyService.getMarketHistory(coinName, vsCurrency, days)
      .pipe(first()).subscribe(marketData => {
        this.rawMarketData$.next(marketData)
        this.formatChartData(marketData)
      })
  }

  formatChartData(marketData: MarketHistoryI): void {
    this.lineChartData = [] // clear default data
    interface DataLabelSeriesI {
      data: number[], label: string[]
    }
    Object.entries(marketData).forEach((keyValTuple: [string, number[][]]) => {
      const dataLabelSeries = keyValTuple[1].reduce((acc: DataLabelSeriesI, tuple) => {
        const dateTime = dayjs(tuple[0]).format('M-D-YY, H:m')
        const price = tuple[1]
        return { data: [...acc.data, price], label: [...acc.label, dateTime] } as DataLabelSeriesI
      }, { data: [], label: [] } as DataLabelSeriesI)
      this.lineChartData.push({
        label: MarketHistorySeries[keyValTuple[0]  as keyof typeof MarketHistorySeries],
        data: dataLabelSeries.data
      })
      this.lineChartLabels = dataLabelSeries.label
    })
  }
}
