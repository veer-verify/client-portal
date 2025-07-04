import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(arr: any[], key: string): unknown {
    return arr.sort((a: any, b: any) => a[key] - b[key]);
  }

}
