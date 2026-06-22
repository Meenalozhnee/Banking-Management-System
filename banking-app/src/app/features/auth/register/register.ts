import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="register-hero">
        <div class="hero-bg">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        <div class="hero-content">
          <div class="brand">
            <div class="brand-icon"><i class="fas fa-university"></i></div>
            <div class="brand-text">
              <span class="brand-name">Sorim</span>
              <span class="brand-sub">Bank Hub</span>
            </div>
          </div>
          <h1 class="hero-title">Start Your<br/>Journey Today.</h1>
          <p class="hero-desc">Join thousands of satisfied customers. Open your account in minutes and experience banking reimagined.</p>
          <div class="benefits">
            <div class="benefit"><i class="fas fa-infinity"></i> <div><strong>Zero Balance</strong><span>No minimum balance required</span></div></div>
            <div class="benefit"><i class="fas fa-percentage"></i> <div><strong>High Interest</strong><span>Up to 7% on savings</span></div></div>
            <div class="benefit"><i class="fas fa-credit-card"></i> <div><strong>Free Debit Card</strong><span>International with zero fees</span></div></div>
          </div>
        </div>
      </div>
      <div class="register-form-section">
        <div class="register-form-wrap">
          <div class="form-header animate-in">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>
          <form (ngSubmit)="onRegister()" #regForm="ngForm" class="animate-in-d1">
            <div class="form-row">
              <div class="field">
                <label>Full Name</label>
                <div class="input-wrap"><i class="fas fa-user"></i><input type="text" name="fullName" [(ngModel)]="fullName" required placeholder="John Doe"/></div>
              </div>
              <div class="field">
                <label>Username</label>
                <div class="input-wrap"><i class="fas fa-user-tag"></i><input type="text" name="username" [(ngModel)]="username" required placeholder="johndoe"/></div>
              </div>
            </div>
            <div class="field">
              <label>Email</label>
              <div class="input-wrap"><i class="fas fa-envelope"></i><input type="email" name="email" [(ngModel)]="email" required placeholder="john@example.com"/></div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Phone</label>
                <div class="input-wrap"><i class="fas fa-phone"></i><input type="tel" name="phone" [(ngModel)]="phone" required placeholder="9876543210"/></div>
              </div>
              <div class="field">
                <label>Date of Birth</label>
                <div class="input-wrap"><i class="fas fa-calendar"></i><input type="date" name="dob" [(ngModel)]="dob" required/></div>
              </div>
            </div>
            <div class="field">
              <label>Address</label>
              <div class="input-wrap"><i class="fas fa-map-marker-alt"></i><input type="text" name="address" [(ngModel)]="address" required placeholder="Your full address"/></div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Password</label>
                <div class="input-wrap"><i class="fas fa-lock"></i><input type="password" name="password" [(ngModel)]="password" required placeholder="Min 6 characters"/></div>
              </div>
              <div class="field">
                <label>Confirm Password</label>
                <div class="input-wrap"><i class="fas fa-check-circle"></i><input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" required placeholder="Re-enter password"/></div>
              </div>
            </div>
            <button type="submit" class="btn-register" [disabled]="!regForm.form.valid">
              Create Account
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
          <div class="form-footer animate-in-d2">
            <span>Already have an account?</span>
            <a routerLink="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page { display: flex; min-height: 100vh; }
    .register-hero { flex: 1; background: linear-gradient(135deg, #0a1628 0%, #0f1a3a 40%, #162255 100%); display: flex; align-items: center; justify-content: center; padding: 60px; position: relative; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .shape { position: absolute; border-radius: 50%; opacity: 0.12; }
    .shape-1 { width: 500px; height: 500px; top: -150px; left: -150px; background: radial-gradient(circle, #f59e0b, transparent); animation: float 14s ease-in-out infinite; }
    .shape-2 { width: 300px; height: 300px; bottom: -80px; right: -80px; background: radial-gradient(circle, #3b82f6, transparent); animation: float 18s ease-in-out infinite reverse; }
    .shape-3 { width: 180px; height: 180px; top: 30%; right: 25%; background: radial-gradient(circle, #10b981, transparent); animation: float 12s ease-in-out infinite 2s; }
    .hero-content { max-width: 460px; position: relative; z-index: 1; }
    .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 40px; }
    .brand-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 24px; color: #0a1628; box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
    .brand-text { display: flex; flex-direction: column; }
    .brand-name { font-size: 22px; font-weight: 800; color: white; letter-spacing: 1px; }
    .brand-sub { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase; }
    .hero-title { font-size: 40px; font-weight: 700; color: white; line-height: 1.15; margin: 0 0 16px; letter-spacing: -0.5px; }
    .hero-desc { color: rgba(255,255,255,0.55); line-height: 1.7; font-size: 15px; margin-bottom: 40px; }
    .benefits { display: flex; flex-direction: column; gap: 18px; }
    .benefit { display: flex; align-items: flex-start; gap: 14px; color: rgba(255,255,255,0.8); }
    .benefit i { font-size: 20px; color: #f59e0b; margin-top: 2px; }
    .benefit strong { display: block; font-size: 14px; color: white; margin-bottom: 2px; }
    .benefit span { font-size: 13px; opacity: 0.6; }
    .register-form-section { width: 540px; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 32px; overflow-y: auto; }
    .register-form-wrap { width: 100%; max-width: 420px; }
    .form-header { margin-bottom: 28px; }
    .form-header h2 { font-size: 26px; font-weight: 700; color: var(--text); margin: 0 0 6px; letter-spacing: -0.5px; }
    .form-header p { color: var(--text-secondary); font-size: 14px; margin: 0; }
    .form-row { display: flex; gap: 14px; }
    .form-row .field { flex: 1; }
    .field { margin-bottom: 18px; }
    .field label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap i { position: absolute; left: 14px; color: var(--text-muted); font-size: 13px; pointer-events: none; }
    .input-wrap input { width: 100%; padding: 12px 14px 12px 40px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 14px; transition: var(--transition); background: var(--surface); box-sizing: border-box; color: var(--text); }
    .input-wrap input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(15,26,58,0.08); }
    .input-wrap input::placeholder { color: var(--text-muted); }
    .btn-register { width: 100%; padding: 13px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 4px; }
    .btn-register:hover:not(:disabled) { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,26,58,0.25); }
    .btn-register:disabled { opacity: 0.5; cursor: not-allowed; }
    .form-footer { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 4px; }
    .form-footer a { color: var(--primary); text-decoration: none; font-weight: 600; transition: var(--transition); }
    .form-footer a:hover { color: var(--primary-light); }
    @media (max-width: 900px) { .register-hero { display: none; } .register-form-section { width: 100%; } }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  fullName = '';
  username = '';
  email = '';
  phone = '';
  dob = '';
  address = '';
  password = '';
  confirmPassword = '';

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 4000 });
      return;
    }
    this.authService.register({
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      phone: this.phone,
      dateOfBirth: this.dob,
      address: this.address,
      password: this.password
    }).subscribe({
      next: () => {
        this.snackBar.open('Registered successfully! Please login.', 'Close', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.message || err.error?.error || 'Registration failed';
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
  }
}
