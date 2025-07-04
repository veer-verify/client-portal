import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {

  transform(array: any[]): any[] {
    return array.reduce((acc, curr) => {
      if(!acc.includes(curr)) {
        acc.push(curr)
      }
      return acc;
    }, []);
  }

}
