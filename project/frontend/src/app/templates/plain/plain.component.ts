import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-plain',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, NavbarComponent, RouterModule,CommonModule,MatIconModule],
  templateUrl: './plain.component.html',
  styleUrl: './plain.component.scss',
})
export class PlainComponent {

  private readonly authService = inject(AuthService);

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
