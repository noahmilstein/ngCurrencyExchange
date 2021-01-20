import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'divide'
})
export class DividePipe implements PipeTransform {
  transform(numerator: number | string, denominator: number| string): number {
    const num = typeof(numerator) === 'number' ? numerator : parseInt(numerator as string, 10)
    const denom = typeof(denominator) === 'number' ? denominator : parseInt(denominator as string, 10)
    return num / denom
  }
}
