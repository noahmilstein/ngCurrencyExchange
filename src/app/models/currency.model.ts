export class Currency {
  currencyCode: string
  currencyName: string

  constructor(init?: Partial<Currency>) {
    Object.assign(this, init)
  }
}

export interface CurrencyFormI {
  fromCurrency: string
  toCurrency: string
  fromValue: number
}

export enum CurrencyFormFields {
  FromCurrency = 'fromCurrency',
  ToCurrency = 'toCurrency',
  FromValue = 'fromValue'
}
