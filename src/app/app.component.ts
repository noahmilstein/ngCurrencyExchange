import { Component, OnInit } from '@angular/core'
import { first } from 'rxjs/operators'
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { CurrenciesRawI, Currency, CurrencyFormI, GetConvertResI } from './currency.model'
import { CurrencyScoopService } from './services/currency-scoop.service'

const currencyFormValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: CurrencyFormI = control.value
  const { fromCurrency, toCurrency, fromValue } = value
  return fromCurrency && toCurrency && fromValue ? null : { invalid: true }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  title = 'ngCurrencyExchange'

  // update dropdown to mimic this UX https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=EUR

  // WORKING HERE :: TODO LIST
  // call api to get value conversion + troubleshoot with api support
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

  allCurrenciesRaw: CurrenciesRawI = {}
  allCurrenciesFormatted: Currency[] = []
  conversionResult: GetConvertResI

  conversionForm = this.fb.group({
    fromCurrency: ['', Validators.required],
    toCurrency: ['', Validators.required],
    fromValue: [1]
  }, { validators: currencyFormValidator })

  get fromCurrency(): FormControl {
    return this.conversionForm.get('fromCurrency') as FormControl
  }
  get toCurrency(): FormControl {
    return this.conversionForm.get('toCurrency') as FormControl
  }

  constructor(private currencyService: CurrencyScoopService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resolveCurrencies()
    this.conversionForm.valueChanges.subscribe((form: CurrencyFormI) => {
      if (this.conversionForm.valid) {
        this.currencyService.getConversion(form.fromValue, form.fromCurrency, form.toCurrency).pipe(first()).subscribe(convertRes => {
          this.conversionResult = convertRes
          console.log('new conversion event')
          /*
            amount: null
            date: "2021-01-19"
            from: null
            timestamp: 1611083834
            to: null
            value: 0
          */
        })
      }
    })
  }

  handleSwap(): void {
    const prevFromCurrency = this.fromCurrency.value
    const prevToCurrency = this.toCurrency.value
    this.conversionForm.patchValue({ fromCurrency: prevToCurrency, toCurrency: prevFromCurrency })
  }

  formatAllCurrencies(): void {
    // WORKING HERE :: move all formatting into service API calls
    this.allCurrenciesFormatted = Object.entries(this.allCurrenciesRaw).map(currency => {
      const { currency_code, currency_name } = currency[1]
      return new Currency({ currencyCode: currency_code, currencyName: currency_name })
    })
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem('currencies')) {
      this.allCurrenciesRaw = JSON.parse(sessionStorage.getItem('currencies') as string)
      this.formatAllCurrencies()
    } else {
      this.currencyService.getCurrencies().subscribe(currencies => {
        console.log(currencies)
        sessionStorage.setItem('currencies', JSON.stringify(currencies.response.fiats))
        this.allCurrenciesRaw = currencies.response.fiats
        this.formatAllCurrencies()
      })
    }
  }
}
