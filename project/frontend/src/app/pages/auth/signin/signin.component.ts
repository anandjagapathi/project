import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  signin() {
    if (!this.signinForm.valid) return;

    this.authService
      .signIn({
        email: this.signinForm.value.email ?? '',
        password: this.signinForm.value.password ?? '',
      })
      .subscribe({
        next: (response: boolean) => {
          console.log(response)
          const redirectURL =
            this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
            '/signed-in-redirect';

          // Navigate to the redirect url
          this.router.navigateByUrl(redirectURL);
        },
        error: (error) => {
          console.log(error);
          // Re-enable the form
          this.signinForm.enable();

          // Reset the form
          if (!(error.response && error.response.status === 401))
            this.signinForm.reset();

          alert('Invalid credentials');
        },
      });
  }
}
