import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable, of } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { StorageCategories } from '../models/storage.model'
import { Currency } from '../models/currency.model'
import { CoinPrice } from '../models/coin-gecko-api.model'

@Injectable()
export class CoinGeckoApiService {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  private readonly coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3/'
  private readonly supportedCurrenciesUrl = this.coinGeckoBaseUrl + 'simple/supported_vs_currencies'
  private readonly allCurrenciesUrl = this.coinGeckoBaseUrl + 'coins/list'
  private readonly getPriceUrl = this.coinGeckoBaseUrl + 'simple/price'
  allCurrencies: object[]

  constructor(protected http: HttpClient) {}

  getPrice(fromCurrency: string, toCurrency: string): Observable<CoinPrice> {
    // https://api.coingecko.com/api/v3/simple/price
    return this.http.get<CoinPrice>(`${this.getPriceUrl}?ids=${fromCurrency}&vs_currencies=${toCurrency}`)
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
