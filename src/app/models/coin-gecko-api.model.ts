export interface CoinPriceI {
  // https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}
  [x: string]: {
    [x: string]: number
  }
}

export interface MarketHistoryI {
  market_caps: number[][]
  prices: number[][]
  total_volumes: number[][]
}
