import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanMatch
{

    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        
        return this._check(segments);
    }


    private _check(segments: UrlSegment[]): Observable<boolean | UrlTree>
    {
        // Check the authentication status
        return this._authService.check().pipe(
            switchMap((authenticated) => {

                // If the user is not authenticated...
                if ( !authenticated )
                {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

                    return of(urlTree);
                }
                // Allow the access
                return of(true);
            })
        );
    }
}
