import { BaseUrl, Environment } from './environment.model'

export const environment = new Environment({
  production: true,
  baseUrl: BaseUrl.Prod,
  // openExchangeRatesApiKey: secrets.openExchangeRatesApiKey,
  // currencyScoopApiKey: secrets.currencyScoopApiKey
})
