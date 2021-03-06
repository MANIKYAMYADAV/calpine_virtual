import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

  transformTofilterDate(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'yyyy-MM-dd');
    return value;
  }
  transformTomciDate(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'yyyy/MM/dd');
    return value;
  }
  transformToDIsplayFormat(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd/MM/y');
    return value;
  }
  transformToMonthlyDate(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'MMM d, y');
    return value;

  }
  transformToDateWithTime(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd/MM/yyyy HH:mm a');
    return value;
  }
}
