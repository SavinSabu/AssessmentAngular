import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private route: Router, private snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let status = `${err.status}`;
            if (["400", "402"].indexOf(status) > -1) {
                this.snackBar.open("Invalid login credentials", "Ok Noted", { duration: 30000 })
                localStorage.clear();
                this.route.navigate(['/sessions/signin']);
            } else if (status == "401") {
                this.snackBar.open("Your session has been terminated as you have logged in on another device", "Ok Noted", { duration: 30000 })
                localStorage.clear();
                this.route.navigate(['/sessions/signin']);
            } else if (status == "403") {
                this.snackBar.open("Permission Denied", "Ok Noted", { duration: 30000 })
            }
            else if (status == '404') {
                this.snackBar.open("Function Not Implemented! Please try later.", "OK Noted!", { duration: 10000 });
            } else {
                const error = (err&&err.error) ? (err.error.heading || err.error.message):false;
                this.snackBar.open(error||'Unknown Response Received', "OK Noted!");
                return throwError(error);
            }
            return next.handle(request);
        }))
    }
}