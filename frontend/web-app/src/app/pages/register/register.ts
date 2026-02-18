import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Alert } from '../../shared/alert/alert/alert';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormField, RouterModule, Alert],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  submitted = false;
  alertMessage = signal('');
  alertType = signal<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'>('primary');
  registerModal = signal({
    phone: '',
    password: ''
  });

  registrationForm = form(this.registerModal, (schemaPath) => {
    required(schemaPath.phone, { message: 'Phone Number is required' });
    pattern(schemaPath.phone, /^[6-9]\d{9}$/, { message: 'Invalid phone number' })
    required(schemaPath.password, { message: 'Password is required' });
  });


  submit() {
    this.submitted = true;

    if (this.registrationForm().invalid()) return;

    this.auth.register({
      phone: this.registrationForm().value().phone,
      password: this.registrationForm().value().password
    }).subscribe((res: any) => {
      if (res.message === 'User registered successfully') {
        this.alertType.set('success');
        this.alertMessage.set('Registration successful! You can now log in.');
        setTimeout(() => {
          this.alertMessage.set('');
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.alertType.set('danger');
        this.alertMessage.set(res.message || 'Registration failed. Please try again.');
      }
    },
      (error) => {
        this.alertType.set('danger');
        this.alertMessage.set(error.error?.message || 'Registration failed. Please try again.');
      });
  }

}
