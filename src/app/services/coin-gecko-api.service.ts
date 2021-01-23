import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable, of } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { StorageCategories } from '../models/storage.model'
import { Currency } from '../models/currency.model'
import { CoinPriceI, MarketHistoryI } from '../models/coin-gecko-api.model'

@Injectable()
export class CoinGeckoApiService {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  private readonly coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3/'
  private readonly supportedCurrenciesUrl = this.coinGeckoBaseUrl + 'simple/supported_vs_currencies'
  private readonly coinsUrl = this.coinGeckoBaseUrl + 'coins'
  private readonly allCurrenciesUrl = this.coinsUrl + '/list'
  private readonly marketHistoryUrl = '/market_chart'
  private readonly getPriceUrl = this.coinGeckoBaseUrl + 'simple/price'
  allCurrencies: object[]

  constructor(protected http: HttpClient) {}

  getPrice(fromCurrency: string, toCurrency: string): Observable<CoinPriceI> {
    // https://api.coingecko.com/api/v3/simple/price
    return this.http.get<CoinPriceI>(`${this.getPriceUrl}?ids=${fromCurrency}&vs_currencies=${toCurrency}`)
  }

  getMarketHistory(coinName: string, vsCurrency: string, days: number | string): Observable<MarketHistoryI> {
    // https://api.coingecko.com/api/v3/coins/{coinName}/market_chart?vs_currency={vsCurrency}&days={days}
    const url = `${this.coinsUrl}/${coinName}${this.marketHistoryUrl}?vs_currency=${vsCurrency}&days=${days}`
    return this.http.get<MarketHistoryI>(url)
  }

  getCurrencies(): Observable<Currency[]> {
    return combineLatest([this.getAllCurrencies(), this.getAllSupportedCurrencies()])
      .pipe(
        first(),
        map(([allCurrencies, allSupported]: [Currency[], string[]]) => {
          return allCurrencies.filter(coin => {
            const isSupported = allSupported.some(supportedCoin => {
              return supportedCoin === (
                coin.symbol.toLowerCase() || coin.id.toLowerCase() || coin.name.toLowerCase()
              )
            })
            return isSupported
          })
        })
      )
  }

  getAllCurrencies(): Observable<Currency[]> {
    // https://api.coingecko.com/api/v3/coins/list
    if (sessionStorage.getItem(StorageCategories.AllCurrencies)) {
      return of(JSON.parse(sessionStorage.getItem(StorageCategories.AllCurrencies) as string) as Currency[])
    } else {
      return this.http.get<Currency[]>(this.allCurrenciesUrl)
    }
  }

  getAllSupportedCurrencies(): Observable<string[]> {
    // https://api.coingecko.com/api/v3/simple/supported_vs_currencies
    return this.http.get<string[]>(this.supportedCurrenciesUrl)
  }
}
