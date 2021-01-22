export class Currency {
  id: string
  symbol: string
  name: string
}

export interface CurrencyFormI {
  fromCurrency: Currency
  fromSearch: string

  toCurrency: Currency
  toSearch: string

  fromValue: number
}

export enum CurrencyFormFields {
  FromCurrency = 'fromCurrency',
  FromSearch = 'fromSearch',
  ToCurrency = 'toCurrency',
  ToSearch = 'toSearch',
  FromValue = 'fromValue'
}
