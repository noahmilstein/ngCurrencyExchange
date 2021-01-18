import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'


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

  currencies$ = new BehaviorSubject<string[]>([])

  conversionForm = this.fb.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    fromValue: [1],
    toValue: [null]
  })

  get from(): FormControl {
    return this.conversionForm.get('from') as FormControl
  }
  // form level custom validation

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resolveCurrencies()
    this.currencies$.pipe(tap(asd => console.log(asd, 'here')))
  }

  getCurrencies(): Observable<string[]> {
    // return this.http.get<object>(this.currenciesUrl).pipe(map(Object.entries))
    return this.http.get<object>(this.currenciesUrl).pipe(map(currencies => {
      return Object.entries(currencies).map(currency => {
        return currency.join(', ')
      })
    }))
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem('currencies')) {
      this.currencies$.next(JSON.parse(sessionStorage.getItem('currencies') as string))
    } else {
      // tslint:disable-next-line: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
      this.getCurrencies().subscribe(currencies => {
        console.log(currencies)
        sessionStorage.setItem('currencies', JSON.stringify(currencies))
        this.currencies$.next(currencies)
      })
    }
  }
}
