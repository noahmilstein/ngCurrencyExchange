export class Environment {
  production: boolean
  baseUrl: BaseUrl
  // openExchangeRatesApiKey: string
  // currencyScoopApiKey: string

  constructor(init?: Partial<Environment>) {
    Object.assign(this, init)
  }
}

export enum BaseUrl {
    Prod = 'TBD',
    Local = 'http://localhost:4200'
}
