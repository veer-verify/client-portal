import { HttpClient } from '@angular/common/http';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../storage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'pdf'
})
export class PdfPipe implements PipeTransform {

  private http = inject(HttpClient);
  private storage_service = inject(StorageService)
  private sanitizer = inject(DomSanitizer);

  transform(url: string): unknown {
    let sanitized: any = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(sanitized)
    const imageBlob = this.http.get(url).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      if (imageBlob instanceof Blob) {
        reader.readAsDataURL(imageBlob);
      } else {
        reject(new Error('Failed to fetch image as Blob'));
      }
    });
    // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
