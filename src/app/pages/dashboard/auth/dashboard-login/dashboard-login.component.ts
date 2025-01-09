import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-login',
  templateUrl: './dashboard-login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class DashboardLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.error = null;

    const loginData = {
      ...this.loginForm.value,
      isAdminPanel: true
    };

    this.authService.signin(loginData).subscribe({
      next: (response) => {
        if (response.role !== 'admin') {
          this.error = 'Access denied. Admin only.';
          this.isLoading = false;
          return;
        }

        // Store token based on remember me preference
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('adminToken', response.token);
        } else {
          sessionStorage.setItem('adminToken', response.token);
        }

        // Store user data
        localStorage.setItem('adminUser', JSON.stringify({
          id: response._id,
          email: response.email,
          role: response.role
        }));

        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}
