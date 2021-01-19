import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
// import { environment } from 'src/environments/environment'

const currencyFormValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: CurrencyFormI = control.value
  const { fromCurrency, toCurrency, fromValue } = value
  return fromCurrency && toCurrency && fromValue ? null : { invalid: true }
}

interface CurrenciesRawI {
  [key: string]: string
}

interface CurrencyFormI {
  fromCurrency: string
  toCurrency: string
  fromValue: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  title = 'ngCurrencyExchange'

  // convert to 3 form field with dropdowns instead of autocomplete
  // then update dropdown to mimic this UX https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=EUR

  // WORKING HERE :: TODO LIST
  // call api to get value conversion
  // implement swap button
  // componentize code
  // basic styling
  // add data visualization
  // price/market history
  // more styling
  // switch to NgRx store
  // implement cryptocurrency exchange rates https://www.coingecko.com/en/api
  // add testing
  // add user signup/login
  // add market movement notification system with email and text
  // styling

  private readonly openExchangeRatesBaseUrl = 'http://openexchangerates.org/api/'
  private readonly currenciesUrl = this.openExchangeRatesBaseUrl + 'currencies.json'
  private readonly convertUrl = this.openExchangeRatesBaseUrl + 'convert'

  allCurrenciesRaw: CurrenciesRawI = {}
  allCurrenciesFormatted: string[] = []
  filteredCurrencies$ = new BehaviorSubject<string[]>([])

  conversionForm = this.fb.group({
    fromCurrency: ['', Validators.required],
    toCurrency: ['', Validators.required],
    fromValue: [1]
  }, { validators: currencyFormValidator })

  get fromCurrency(): FormGroup {
    return this.conversionForm.get('fromCurrency') as FormGroup
  }
  get toCurrency(): FormGroup {
    return this.conversionForm.get('toCurrency') as FormGroup
  }
  get toValue(): FormGroup {
    return this.conversionForm.get('toValue') as FormGroup
  }
  get fromValue(): FormGroup {
    return this.conversionForm.get('fromValue') as FormGroup
  }

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resolveCurrencies()
  }

  getCurrencies(): Observable<CurrenciesRawI> {
    return this.http.get<CurrenciesRawI>(this.currenciesUrl)
  }

  getConversion(value: number, from: string, to: string): void {
  // getConversion(value: number, from: string, to: string): Observable<object> {
    console.log('CONVERT', {from, to, value})
    // return this.http.get<object>(`${this.convertUrl}/${value}/${from}/${to}?app_id=${environment.openExchangeRatesApiKey}`)
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem('currencies')) {
      this.allCurrenciesRaw = JSON.parse(sessionStorage.getItem('currencies') as string)
      this.allCurrenciesFormatted = Object.entries(this.allCurrenciesRaw).map(tuple => tuple.join(': '))
    } else {
      this.getCurrencies().subscribe(currencies => {
        sessionStorage.setItem('currencies', JSON.stringify(currencies))
        this.allCurrenciesRaw = currencies
        this.allCurrenciesFormatted = Object.entries(this.allCurrenciesRaw).map(tuple => tuple.join(': '))
      })
    }
  }
}
