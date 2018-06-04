import { Pipe, PipeTransform } from '@angular/core';
type TDirection = 'asc' | 'desc';
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args || args.length === 0) {
      return value;
    }

    let copy = [...value];

    let direction: TDirection = args[0] === '-' ? 'desc' : 'asc';
    args = args[0] === '-' ? args.slice(1) : args;

    return copy.sort((a, b) => {
      if (typeof a[args] === 'string' || typeof b[args] === 'string') {
        return this._compare(a[args].toLowerCase(), b[args].toLowerCase(), direction);
      } else {
        return this._compare(a[args], b[args], direction);
      }

    });
  }

  _compare(a: any, b: any, direction: TDirection): number {
    if (direction === 'desc') {
      return b > a ? 1 : -1;
    } else {
      return a < b ? -1 : 1;
    }
  }

}
