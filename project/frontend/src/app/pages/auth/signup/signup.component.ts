import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-signup',
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
    MatSelectModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  signup() {
    if (this.signupForm.valid) {
      this.authService
        .signup(
          this.signupForm.value.name ?? '',
          this.signupForm.value.type ?? '',
          this.signupForm.value.email ?? '',
          this.signupForm.value.password ?? ''
        )
        .subscribe({
          next: () => {
            alert('User created. You will be directed to signin screen');
            this.router.navigate(['/sign-in']);
          },
        });
    }
  }
}
