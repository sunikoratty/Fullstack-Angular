import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const auth = inject(Auth);
  // const token = auth.getToken();
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // if (token) {
  //   req = req.clone({
  //     setHeaders: { Authorization: `Bearer ${token}` }
  //   });
  // }
  // return next(req);
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && isPlatformBrowser(platformId)) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
