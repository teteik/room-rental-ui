import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if(token) {
        const cloneReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloneReq);
    }
    return next(req).pipe(
        catchError((error) => {
            const publicUrls = ['/api/auth/login', '/api/auth/register'];
            if (error.status === 401 && !publicUrls.some(url => req.url.includes(url))) {
                inject(AuthService).logout();
            }
            return throwError(() => error);
        })
    );
}