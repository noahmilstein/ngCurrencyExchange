import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { Currency, CurrencyFormFields, CurrencyFormI } from '../../models/currency.model'
import { StorageCategories } from '../../models/storage.model'
import { CoinGeckoApiService } from '../../services/coin-gecko-api.service'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject'
import { first } from 'rxjs/operators'

const currencyFormValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: CurrencyFormI = control.value
  const { fromCurrency, toCurrency, fromValue } = value
  return fromCurrency && toCurrency && fromValue ? null : { invalid: true }
}

@Component({
  selector: 'app-conversion-form',
  templateUrl: './conversion-form.component.html',
  styleUrls: ['./conversion-form.component.scss']
})
export class ConversionFormComponent implements OnInit {
  // tslint:disable: deprecation (https://github.com/ReactiveX/rxjs/issues/4159#issuecomment-466630791)
  conversionForm = this.fb.group({
    fromSearch: [''],
    fromCurrency: [null, Validators.required],
    toCurrency: [null, Validators.required],
    toSearch: [''],
    fromValue: [1, Validators.required],
    priceResult: [null]
  }, { validators: currencyFormValidator })

  get fromCurrency(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.FromCurrency) as FormControl
  }
  get fromSearch(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.FromSearch) as FormControl
  }
  get toCurrency(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.ToCurrency) as FormControl
  }
  get toSearch(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.ToSearch) as FormControl
  }
  get fromValue(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.FromValue) as FormControl
  }
  get priceResult(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.PriceResult) as FormControl
  }

  allCurrenciesFormatted: Currency[] = []
  currencyFilter$ = new BehaviorSubject<Currency[]>([])

  constructor(private currencyService: CoinGeckoApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resolveCurrencies()
    this.conversionForm.valueChanges.subscribe((form: CurrencyFormI) => {
      if (this.conversionForm.valid) {
        // WORKING HERE
        // display historical market data in graph
        // individual currency details page
        // explore swapping API source to coinmarketcap (https://coinmarketcap.com/api/documentation/v1/)
        this.currencyService.getPrice(form.fromCurrency.name, form.toCurrency.symbol)
          .pipe(first()).subscribe(price => {
            const from = price[form.fromCurrency.name.toLowerCase()]
            const toPrice = from[form.toCurrency.symbol]
            this.priceResult.setValue(toPrice, { emitEvent: false })
          })
        }
      })
    this.fromSearch.valueChanges.subscribe((fromSearch: string) => {
      this.setSearchFilter(fromSearch)
    })
    this.toSearch.valueChanges.subscribe((toSearch: string) => {
      this.setSearchFilter(toSearch)
    })
  }

  handleOptionClick(formControl: FormControl, coin: Currency): void {
    formControl.setValue(coin)
  }

  handleFocus(searchFieldValue?: string): void {
    if (searchFieldValue) {
      this.setSearchFilter(searchFieldValue)
    } else {
      this.currencyFilter$.next(this.allCurrenciesFormatted)
    }
  }

  setSearchFilter(searchText: string): void {
    const filteredResults = this.allCurrenciesFormatted.filter(coin => {
      const search = searchText.toLowerCase()
      return coin.symbol.includes(search) || coin.id.includes(search) || coin.name.includes(search)
    })
    this.currencyFilter$.next(filteredResults)
  }

  handleSwap(): void {
    const prevFromCurrency = this.fromCurrency.value
    const prevToCurrency = this.toCurrency.value
    const prevFromSearch = this.fromSearch.value
    const prevToSearch = this.toSearch.value
    this.conversionForm.patchValue({
      fromCurrency: prevToCurrency,
      toCurrency: prevFromCurrency,
      fromSearch: prevToSearch,
      toSearch: prevFromSearch
    })
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem(StorageCategories.Currencies)) {
      this.allCurrenciesFormatted = JSON.parse(sessionStorage.getItem(StorageCategories.Currencies) as string)
      this.currencyFilter$.next(this.allCurrenciesFormatted)
    } else {
      this.currencyService.getCurrencies().subscribe(currencies => {
        sessionStorage.setItem(StorageCategories.Currencies, JSON.stringify(currencies))
        this.allCurrenciesFormatted = currencies
        this.currencyFilter$.next(this.allCurrenciesFormatted)
      })
    }
  }
}
