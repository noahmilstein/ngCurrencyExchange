import { secrets } from 'secrets'

export class Environment {
  production: boolean
  baseUrl: BaseUrl
  openExchangeRatesApiKey: string

  constructor(init?: Partial<Environment>) {
    Object.assign(this, init)
  }
}

export enum BaseUrl {
    Prod = 'TBD',
    Local = 'http://localhost:4200'
}
