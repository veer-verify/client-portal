import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keysPipe'
})
export class keysPipe implements PipeTransform {
  /**
* Transform
*
* @param {any[]} items
* @param {string} searchText
* @returns {any[]}
*/

  transform(items: any[], searchText: string): any {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
   
  }
}
