export class Currency {
  currencyCode: string
  currencyName: string

  constructor(init?: Partial<Currency>) {
    Object.assign(this, init)
  }
}
// WORKING HERE :: break up into appropriate separate files

export interface CurrencyFormI {
  fromCurrency: string
  toCurrency: string
  fromValue: number
}

interface MetaI {
  code: number
  disclaimer: string
}

export interface GetCurrenciesResI {
  meta: MetaI
  response: {
    fiats: CurrenciesRawI
  }
}

export interface CurrenciesRawI {
  [key: string]: CurrencyResI
}

export interface CurrencyResI {
  countries: string[]
  currency_code: string
  currency_name: string
  decimal_units: string
}

export interface GetConvertResI {
  meta: MetaI
  response: ConvertResI
}

export interface ConvertResI {
  amount: number
  date: string
  from: string
  timestamp: number
  to: string
  value: number
}
