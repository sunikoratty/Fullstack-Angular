import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  // Signal Inputs (Read-only)
  message = input<string>('');

  // Restricted to Bootstrap-specific types
  type = input<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'>('primary');
}
