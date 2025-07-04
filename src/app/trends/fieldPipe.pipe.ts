import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FieldName'
})
export class FieldPipe implements PipeTransform {
  /**
* Transform
*
* @param {any[]} items
* @param {string} searchField
* @returns {any[]}
*/

  transform(items: any[], searchField: string): any {
    // if (!items) return [];
    // if (!searchField) return items;
    // return items.filter(item => {
    //   return Object.keys(item).some(key => {
    //     return String(item[key]).toLowerCase().includes(searchField.toLowerCase());
    //   });
    // });
    if (!items) return [];
    if (!searchField) return items;
    return items.filter((res) => {
        return res.service.toLowerCase().includes(searchField.toLowerCase());
    });
    }
  }

