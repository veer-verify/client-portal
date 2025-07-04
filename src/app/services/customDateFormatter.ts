import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split(this.DELIMITER);
      if (dateParts.length === 3) {
        return {
          day: parseInt(dateParts[0], 10),
          month: parseInt(dateParts[1], 10),
          year: parseInt(dateParts[2], 10)
        };
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${this.formatNumber(date.month)}${this.DELIMITER}${this.formatNumber(date.day)}${this.DELIMITER}${date.year}` : '';
  }

  private formatNumber(value: number): string {
    return `${value < 10 ? '0' : ''}${value}`;
  }
}
