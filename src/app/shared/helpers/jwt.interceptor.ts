import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
        if (currentUser && localStorage.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.token}`,
                    InAs: localStorage.inas ? `${localStorage.inas}` : `{}`
                }
            });
        }
        return next.handle(request);
    }
}