import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(text: string): string {
    const splitText = text.split(' ')
    return splitText.map(this.capitalize).join(' ')
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.substr(1)
  }
}
