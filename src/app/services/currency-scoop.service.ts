import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { GetCurrenciesResI, GetConvertResI } from '../models/currency-scoop.model'
import { Currency } from '../models/currency.model'

@Injectable()
export class CurrencyScoopService {
  private readonly currencyScoopBaseUrl = 'https://api.currencyscoop.com/v1/'
  private readonly currenciesUrl = this.currencyScoopBaseUrl + 'currencies'
  private readonly convertUrl = this.currencyScoopBaseUrl + 'convert'
  private readonly timeSeriesUrl = this.currencyScoopBaseUrl + 'timeseries'
  private readonly apiKeyFragment = `api_key=${environment.currencyScoopApiKey}`

  constructor(protected http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<GetCurrenciesResI>(
      `${this.currenciesUrl}?${this.apiKeyFragment}`
    ).pipe(map(this.formatGetCurrenciesRes))
  }

  getConversion(value: number, from: string, to: string): Observable<GetConvertResI> {
    const convertFragment = `?base=${from}&to=${to}&amount=${value}&${this.apiKeyFragment}`
    // troubleshoot http request syntax with api support
    return this.http.get<GetConvertResI>(this.convertUrl + convertFragment)
  }

  getTimeSeries(base: string, startDate: Date, endDate: Date, symbols: string[]): Observable<object> {
    // WORKING HERE :: create interfaces for endpoint response
    const latestFragment = `?base=${base}&start_date=${startDate}&end_date=${endDate}&symbols=${symbols}&${this.apiKeyFragment}`
    return this.http.get<object>(this.timeSeriesUrl + latestFragment)
  }

  formatGetCurrenciesRes(allCurrencies: GetCurrenciesResI): Currency[] {
    return Object.entries(allCurrencies.response.fiats).map(currency => {
      const { currency_code, currency_name } = currency[1]
      return new Currency({ currencyCode: currency_code, currencyName: currency_name })
    })
  }
}
