import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  sanitizedUrls: Map<string, SafeResourceUrl> = new Map();
  transform(value: any, ...args: unknown[]): any {
    if (value === undefined) {
      return null;
    } else {
      let sanitizedUrl = this.sanitizedUrls.get(value);
      if (!sanitizedUrl) {
        sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
        this.sanitizedUrls.set(value, sanitizedUrl);
      }
      return sanitizedUrl;
    }
  }

}
