import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
// import { environment } from 'src/environments/environment'

const currencyFormValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: CurrencyFormI = control.value
  const { fromCurrency, toCurrency, fromValue, toValue } = value
  return fromCurrency && toCurrency && (fromValue || toValue) ? null : { invalid: true }
}

function currencyValidator(allCurrenciesRaw: CurrenciesRawI): ValidatorFn {
  return (control: AbstractControl): {[key: string]: string} | null => {
    const code = control.value.match(/^\w{3}/)
    if (code && allCurrenciesRaw[code]) {
      return null
    } else {
      return { invalidCurrency: 'Invalid Currency' }
    }
  }
}

interface CurrenciesRawI {
  [key: string]: string
}

interface CurrencyFormI {
  fromCurrency: string
  toCurrency: string
  fromValue: number
  toValue: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngCurrencyExchange'

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
    fromCurrency: [''],
    toCurrency: [''],
    fromValue: [1],
    toValue: [null]
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
    this.fromCurrency.setValidators([Validators.required, currencyValidator(this.allCurrenciesRaw)])
    this.toCurrency.setValidators([Validators.required, currencyValidator(this.allCurrenciesRaw)])

    // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
    this.fromCurrency.valueChanges.subscribe(from => {
      this.setCurrencyFilter(from)
      if (this.conversionForm.valid) {
        this.getConversion(this.fromValue.value, this.fromCurrency.value, this.toCurrency.value)
        // get the TO VALUE and update the toValue field
      }
    })
    this.toCurrency.valueChanges.subscribe(to => {
      this.setCurrencyFilter(to)
      if (this.conversionForm.valid) {
        this.getConversion(this.fromValue.value, this.fromCurrency.value, this.toCurrency.value)
        // get the TO VALUE and update the toValue field
      }
    })
    // this.conversionForm.valueChanges.subscribe(form => {
    //   if (form.valid) {
    //     // WORKING HERE
    //     // call API and get and update the TO VALUE
    //     this.getConversion(toVal, this.fromCurrency.value, this.toCurrency.value)
    //     // https://openexchangerates.org/api/convert/1/USD/AED?app_id=app_id
    //   }
    // })
    this.toValue.valueChanges.subscribe((toVal: number) => {
      // if toVal is changing and form isValid then call API to update the FROM VALUE
      if (this.conversionForm.valid) {
        this.getConversion(toVal, this.toCurrency.value, this.fromCurrency.value)
        // get the FROM VALUE and update the fromValue field
      }
    })
    this.fromValue.valueChanges.subscribe((fromVal: number) => {
      // if toVal is changing and form isValid then call API to update the FROM VALUE
      if (this.conversionForm.valid) {
        this.getConversion(fromVal, this.fromCurrency.value, this.toCurrency.value)
        // get the TO VALUE and update the toValue field
      }
    })
  }

  setCurrencyFilter(filterText: string): void {
    const filter = this.allCurrenciesFormatted.filter(currency => {
      return currency.toLowerCase().includes(filterText.toLowerCase())
    })
    this.filteredCurrencies$.next(filter)
  }

  handleCurrencyFocus(currencyValue?: string): void {
    if (currencyValue) {
      // filter on pre-existing value
      this.setCurrencyFilter(currencyValue)
    } else {
      // reset filter
      this.filteredCurrencies$.next(this.allCurrenciesFormatted)
    }
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
