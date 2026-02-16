import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormField, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  submitted = false;
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
    }).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
