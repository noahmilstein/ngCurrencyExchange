// all currency scoop API models/interfaces here
// SEE HERE :: https://currencyscoop.com/api-documentation
interface MetaI {
  code: number
  disclaimer: string
}

export interface GetCurrenciesResI {
  // API call to GET all currencies
  // 'https://api.currencyscoop.com/v1/currencies'
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
  // API call to GET conversion between 2 currencies
  // 'https://api.currencyscoop.com/v1/convert'
  meta: MetaI
  response: ConvertResI
}

export interface ConvertResI {
  amount: string
  date: string
  from: string
  timestamp: number
  to: string
  value: number
}
