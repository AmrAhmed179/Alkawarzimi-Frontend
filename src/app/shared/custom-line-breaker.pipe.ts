import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customLineBreaker'
})
export class CustomLineBreakerPipe implements PipeTransform {

  transform(value: string, characterLimit?: number): string {
    const lines = value.split(' ');
    let result = '';
    let currentLine = '';

    for (const word of lines) {
      const combinedLength = currentLine.length + word.length + 1;
      if (combinedLength > characterLimit || combinedLength === 0) {
        result += `${currentLine}\n`;
        currentLine = '';
      }
      currentLine += word + ' ';
    }

    return result + currentLine.trim();
  }

}