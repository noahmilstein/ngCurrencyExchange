import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'
import { ConvertResI } from 'src/app/models/currency-scoop.model'
import { Currency, CurrencyFormFields, CurrencyFormI } from 'src/app/models/currency.model'
import { StorageCategories } from 'src/app/models/storage.model'
import { CurrencyScoopService } from 'src/app/services/currency-scoop.service'
// import * as dayjs from 'dayjs'

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
    fromCurrency: ['', Validators.required],
    toCurrency: ['', Validators.required],
    fromValue: [1]
  }, { validators: currencyFormValidator })

  get fromCurrency(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.FromCurrency) as FormControl
  }
  get toCurrency(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.ToCurrency) as FormControl
  }
  get fromValue(): FormControl {
    return this.conversionForm.get(CurrencyFormFields.FromValue) as FormControl
  }

  allCurrenciesFormatted: Currency[] = []
  conversionResult: ConvertResI

  constructor(private currencyService: CurrencyScoopService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resolveCurrencies()
    this.conversionForm.valueChanges.subscribe((form: CurrencyFormI) => {
      if (this.conversionForm.valid) {
        this.currencyService.getConversion(form.fromValue, form.fromCurrency, form.toCurrency)
        .pipe(first()).subscribe(convertRes => {
          this.conversionResult = convertRes.response
        })
        // NOTE :: /timeseries requires $99/month which is just not worth it and makes this project pointless to continue
        // Switching to a different project instead of spending tons of money for no good reason
        // const today = dayjs().startOf('day')
        // const thirtyDaysPast = today.subtract(30, 'day')
        // this.currencyService.getTimeSeries(
        //   form.fromCurrency,
        //   today.format('YYYY-MM-DD'),
        //   thirtyDaysPast.format('YYYY-MM-DD'),
        //   [form.toCurrency]
        // ).pipe(first()).subscribe(latest => {
        //   console.log(latest)
        // })
      }
    })
  }

  handleSwap(): void {
    const prevFromCurrency = this.fromCurrency.value
    const prevToCurrency = this.toCurrency.value
    this.conversionForm.patchValue({ fromCurrency: prevToCurrency, toCurrency: prevFromCurrency })
  }

  resolveCurrencies(): void {
    if (sessionStorage.getItem(StorageCategories.Currencies)) {
      this.allCurrenciesFormatted = JSON.parse(sessionStorage.getItem(StorageCategories.Currencies) as string)
    } else {
      this.currencyService.getCurrencies().subscribe(currencies => {
        sessionStorage.setItem(StorageCategories.Currencies, JSON.stringify(currencies))
        this.allCurrenciesFormatted = currencies
      })
    }
  }
}
