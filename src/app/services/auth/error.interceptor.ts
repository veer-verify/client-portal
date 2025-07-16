import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './authservice.service';
import { StorageService } from '../storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);


  constructor(
    private router: Router,
    private authSer: AuthService,
    private storageService: StorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('acTok');

    // let token = this.refreshTokenSubject.pipe(
    //   filter(token => token != null),
    //   take(1),
    //   switchMap(accessToken => {
    //     console.log(accessToken)
    //     return next.handle(this.addToken(request, accessToken));
    //   })
    // );

    if (token) {
      request = this.addToken(request, JSON.parse(token));
    }

    return next.handle(request).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }



  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    let currentUser = this.storageService.getEncrData('user');

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.storageService.loader_sub.next(true);
      return this.authSer.getAccessforRefreshToken(currentUser).pipe(
        switchMap((res: any) => {
          this.storageService.loader_sub.next(false);
          localStorage.setItem('acTok', JSON.stringify(res.access_token));
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access_token);
          return next.handle(this.addToken(request, res.access_token));
        }),
        catchError((err) => {
          this.storageService.loader_sub.next(false);
          this.isRefreshing = false;
          // this.authSer.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(accessToken => {
          // console.log(accessToken)
          return next.handle(this.addToken(request, accessToken));
        })
      );
    }
  }


}
