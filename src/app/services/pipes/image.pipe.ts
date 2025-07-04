import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
  ) { }

  
  async transform(url: string): Promise<any> {
    const token = localStorage.getItem('acTok');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const imageBlob = await this.http.get(url as string, { headers, responseType: 'blob' }).toPromise() as Blob;
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      if (imageBlob instanceof Blob) {
        reader.readAsDataURL(imageBlob);
      } else {
        reject(new Error('Failed to fetch image as Blob'));
      }
    });
  }

}
