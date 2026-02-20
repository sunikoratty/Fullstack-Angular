import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Alert } from '../../shared/alert/alert/alert';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Alert],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  submitted = false;

  alertMessage = signal('');
  alertType = signal<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'>('primary');
  constructor(private auth: Auth, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }



  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.alertType.set('success');
        this.alertMessage.set('Login successful!');

        // Auto-hide after 3 seconds
        setTimeout(() => {
          this.alertMessage.set('')
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error: (err) => {
        this.alertType.set('danger');
        this.alertMessage.set(err.error?.message || 'Login failed. Please check your credentials.');
        setTimeout(() => {
          this.alertMessage.set('')
        }, 3000);
      }
    });
  }
}
