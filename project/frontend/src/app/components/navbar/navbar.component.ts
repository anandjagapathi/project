import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  // private readonly router = inject(Router);

  isLoggedIn: boolean = this.authService.isLoggedIn();
  userType = this.authService.getUser()?.type;
  private subscription: Subscription = this.authService
    .onSigninStatusChange()
    .subscribe({
      next: (status) => {
        this.userType = this.authService.getUser()?.type;
        this.isLoggedIn = status;
      },
    });

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
