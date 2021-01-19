import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { GetCurrenciesResI, GetConvertResI } from '../currency.model'

@Injectable()
export class CurrencyScoopService {
  private readonly currencyScoopBaseUrl = 'https://api.currencyscoop.com/v1/'
  private readonly currenciesUrl = this.currencyScoopBaseUrl + 'currencies'
  private readonly convertUrl = this.currencyScoopBaseUrl + 'convert'

  constructor(protected http: HttpClient) {}

  getCurrencies(): Observable<GetCurrenciesResI> {
    return this.http.get<GetCurrenciesResI>(`${this.currenciesUrl}?api_key=${environment.currencyScoopApiKey}`)
  }

  getConversion(value: number, from: string, to: string): Observable<GetConvertResI> {
    const convertFragment = `&base=${from}&to=${to}&amount=${value}?api_key=${environment.currencyScoopApiKey}`
    // troubleshoot http request syntax with api support
    return this.http.get<GetConvertResI>(this.convertUrl + convertFragment)
  }

}
