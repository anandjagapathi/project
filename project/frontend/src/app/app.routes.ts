import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { PlainComponent } from './templates/plain/plain.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { AvailableCarsComponent } from './pages/public/available-cars/available-cars.component';
import { BookingsComponent } from './pages/customer/bookings/bookings.component';
import { CarOwnerProfileComponent } from './pages/car-owner/car-owner-profile/car-owner-profile.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

const canActivateCustomer: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);

  return authService.isLoggedIn() && authService.getUser()?.type === 'customer';
};

const canActivateOwner: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);

  return authService.isLoggedIn() && authService.getUser()?.type === 'owner';
};
export const routes: Routes = [
  {
    path: 'sign-up',
    component: SignupComponent,
  },
  {
    path: 'sign-in',
    component: SigninComponent,
  },
  {
    path: 'customer',
    component: PlainComponent,
    canActivate: [canActivateCustomer],
    children: [
      {
        path: 'bookings',
        component: BookingsComponent,
      },
    ],
  },
  {
    path: 'owner',
    component: PlainComponent,
    canActivate: [canActivateOwner],
    children: [
      {
        path: 'profile',
        component: CarOwnerProfileComponent,
      },
    ],
  },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'list' },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: '',
    resolve: {
      initialData: async (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ) => {
        const authService = inject(AuthService);
        await authService.check().subscribe();
        return {};
      },
    },
    component: PlainComponent,
    children: [
      {
        path: 'list',
        component: AvailableCarsComponent,
      },
    ],
  },
];
