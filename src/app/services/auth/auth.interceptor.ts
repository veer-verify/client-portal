import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.storageService.getEncrData('user');

    // if(user?.AccessToken) {
      const authReq = request.clone({
        setHeaders: {
          // Authorization: `Bearer ${user.AccessToken}`
          'Referrer-Policy': 'unsafe-url',
        }
      });
      return next.handle(authReq);
    // }
    // return next.handle(request);
  }
}
