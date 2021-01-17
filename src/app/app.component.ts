import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngCurrencyExchange'

  // TODO ::
  // build form with

  // "currency from"
  // "currency to"
  // "value from"
  // "value to"

  // TODO :: switch to NgRx store
  // TODO :: implement cryptocurrency exchange rates https://www.coingecko.com/en/api

  private readonly openExchangeRatesBaseUrl = 'http://openexchangerates.org/api/'
  private readonly currenciesUrl = this.openExchangeRatesBaseUrl + 'currencies.json'

  currencies$ = new BehaviorSubject<object>({})

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.resolveCurrencies()
    this.currencies$.pipe(tap(console.log))
  }

  getCurrencies(): Observable<object> {
    return this.http.get<object>(this.currenciesUrl)
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem('currencies')) {
      this.currencies$.next(JSON.parse(sessionStorage.getItem('currencies') as string))
    } else {
      // tslint:disable-next-line: deprecation
      this.getCurrencies().subscribe(currencies => {
        sessionStorage.setItem('currencies', JSON.stringify(currencies))
        this.currencies$.next(currencies)
      })
    }
  }
}
