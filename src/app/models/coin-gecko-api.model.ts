export interface CoinPrice {
  // https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}
  [x: string]: {
    [x: string]: number
  }
}
