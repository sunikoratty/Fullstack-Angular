import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  previewImage: string | null = null;

  form = this.fb.group({
    fullName: [''],
    dob: [''],
    sex: [''],
    qualification: [''],
    photo: ['']
  });

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (res) => {

        // Convert ISO date to yyyy-MM-dd for input type="date"
        const formattedDate = res.dob
          ? new Date(res.dob).toISOString().split('T')[0]
          : '';

        this.form.patchValue({
          fullName: res.fullName,
          dob: formattedDate,
          sex: res.sex,
          qualification: res.qualification,
          photo: res.photo || ''
        });

        this.previewImage = res.photo || null;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.previewImage = base64;
      this.form.patchValue({ photo: base64 });
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }
  
  removePhoto() {
    this.previewImage = null;
    this.form.patchValue({ photo: '' });
  }

  update() {
    if (this.form.invalid) return;

    this.auth.updateProfile(this.form.value).subscribe({
      next: () => alert('Profile updated successfully'),
      error: () => alert('Update failed')
    });
  }
}
