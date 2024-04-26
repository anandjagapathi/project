import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  from,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../types/user.type';
import {
  createDirectus,
  createUser,
  login,
  logout,
  readMe,
  refresh,
  rest,
  staticToken,
} from '@directus/sdk';
import { AuthUtils } from '../utils/auth.utils';
import { environment } from '../../environments/environment.development';
import { NgxSpinnerService } from 'ngx-spinner';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public directus_client = createDirectus(environment.api_url)
    .with(staticToken(''))
    .with(rest());

  private authStatus: boolean = false;
  private readonly accessToken_localstorage_key = 'accessToken';
  private readonly refreshToken_localstorage_key = 'refreshToken';
  private ui = inject(UIService)

  set accessToken(token: string) {
    localStorage.setItem(this.accessToken_localstorage_key, token);
  }

  get accessToken(): string {
    return localStorage.getItem(this.accessToken_localstorage_key) ?? '';
  }

  set refreshToken(token: string) {
    localStorage.setItem(this.refreshToken_localstorage_key, token);
  }

  get refreshToken(): string {
    return localStorage.getItem(this.refreshToken_localstorage_key) ?? '';
  }

  constructor() {}

  private signinStatus = new BehaviorSubject<boolean>(false);
  private current_user: User | null = null;

  signIn(credentials: { email: string; password: string }): Observable<any> {
    if (this.authStatus)
      return throwError(() => new Error('User is already logged in.'));

    this.ui.showSpinner();
    return from(
      this.directus_client.request(
        login(credentials.email, credentials.password, {
          mode: 'json',
        })
      )
    ).pipe(
      switchMap((response: any) => {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.directus_client.setToken(response.access_token);
        return from(this.directus_client.request(readMe())).pipe(
          tap((userResponse: any) => {
            this.current_user = {
              id: userResponse.id,
              email: userResponse.email,
              name: userResponse.first_name + ' ' + userResponse.last_name,
              type:
                userResponse.role === 'a7ef6c56-8edc-4a71-8f81-d51afb2bb736'
                  ? 'customer'
                  : 'owner',
            };
          }),
          switchMap(() => {
            this.authStatus = true;
            this.signinStatus.next(true);
            return of(response);
          })
        );
      }),
      finalize(() => this.ui.hideSpinner())
    );
  }

  signInUsingToken(): Observable<any> {
    this.ui.showSpinner();
    return from(
      this.directus_client.request(refresh('json', this.refreshToken))
    ).pipe(
      catchError(() => {
        return of(false);
      }),
      switchMap((response: any) => {
        if (!response) return of(false);

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.directus_client.setToken(response.access_token);

        return from(this.directus_client.request(readMe())).pipe(
          tap((userResponse: any) => {
            this.current_user = {
              id: userResponse.id,
              email: userResponse.email,
              name: userResponse.first_name + ' ' + userResponse.last_name,
              type:
                userResponse.role === 'a7ef6c56-8edc-4a71-8f81-d51afb2bb736'
                  ? 'customer'
                  : 'owner',
            };
          }),
          switchMap(() => {
            this.authStatus = true;
            this.signinStatus.next(true);
            return of(response);
          })
        );
      }),
      finalize(() => this.ui.hideSpinner())
    );
  }

  logout(): Observable<any> {
    this.ui.showSpinner();
    this.directus_client
      .request(logout(this.refreshToken))
      .then()
      .finally(() => this.ui.hideSpinner());

    // Remove the access token from the local storage
    localStorage.removeItem(this.accessToken_localstorage_key);
    localStorage.removeItem(this.refreshToken_localstorage_key);

    // Set the authenticated flag to false
    this.authStatus = false;
    this.current_user = null;
    this.signinStatus.next(false);

    // Return the observable
    return of(true);
  }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this.authStatus) {
      return of(true);
    }

    // Check the access token and refresh token availability
    if (!this.accessToken || !this.refreshToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    return this.signInUsingToken();
  }


  signup(name: string, type: any, email: string, password: string) {
    this.ui.showSpinner();
    return from(
      this.directus_client.request(
        createUser({
          first_name: name.split(' ')[0] ?? ' ',
          last_name: this.concatAfterFirstSpace(name),
          email: email,
          password: password,
          role:
            type === 'customer'
              ? 'a7ef6c56-8edc-4a71-8f81-d51afb2bb736'
              : 'f5f2ff19-3961-4d17-b886-e4b51dfbeda3',
        })
      )
    ).pipe(finalize(() => this.ui.hideSpinner()));
  }

  private concatAfterFirstSpace(str: string) {
    try {
      const parts = str.split(' ');
      return parts.slice(1).join(' ');
    } catch (err) {
      return ' ';
    }
  }

  getUser(): User | null {
    return this.current_user;
  }

  isLoggedIn(): boolean {
    return this.authStatus;
  }

  onSigninStatusChange() {
    return this.signinStatus.asObservable();
  }
}
