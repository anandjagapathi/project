import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoggedIn: boolean = this.authService.isLoggedIn();
  private subscription: Subscription = this.authService
    .onSigninStatusChange()
    .subscribe({
      next: (status) => {
        this.isLoggedIn = status;
      },
    });

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showsignin() {
    this.router.navigate(['sign-in']);
  }

  signUp() {
    this.router.navigate(['sign-up']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
