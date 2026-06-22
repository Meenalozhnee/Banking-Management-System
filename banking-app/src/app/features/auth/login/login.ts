import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatSnackBarModule, MatButtonModule],
  template: `
    <div class="login-page">
      <div class="login-hero">
        <div class="hero-bg">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
        <div class="hero-content">
          <div class="brand">
            <div class="brand-icon"><i class="fas fa-university"></i></div>
            <div class="brand-text">
              <span class="brand-name">Sorim</span>
              <span class="brand-sub">Bank Hub</span>
            </div>
          </div>
          <h1 class="hero-title">Modern Banking,<br/>Simplified.</h1>
          <p class="hero-desc">Secure, fast, and intelligent banking. Manage your finances with confidence from anywhere in the world.</p>
          <div class="hero-stats">
            <div class="stat"><span class="stat-value">10K+</span><span class="stat-label">Happy Customers</span></div>
            <div class="stat"><span class="stat-value">99.9%</span><span class="stat-label">Uptime</span></div>
            <div class="stat"><span class="stat-value">4.8★</span><span class="stat-label">App Rating</span></div>
          </div>
        </div>
      </div>
      <div class="login-form-section">
        <div class="login-form-wrap">
          <div class="form-header animate-in">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="animate-in-d1">
            <div class="field">
              <label>Username</label>
              <div class="input-wrap">
                <i class="fas fa-user"></i>
                <input type="text" name="username" [(ngModel)]="username" required placeholder="Enter your username" autocomplete="username"/>
              </div>
            </div>
            <div class="field">
              <label>Password</label>
              <div class="input-wrap">
                <i class="fas fa-lock"></i>
                <input type="password" name="password" [(ngModel)]="password" required placeholder="Enter your password" autocomplete="current-password"/>
              </div>
            </div>
            <button type="submit" class="btn-login" [disabled]="!loginForm.form.valid">
              Sign In
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
          <div class="form-footer animate-in-d2">
            <span>Don't have an account?</span>
            <a routerLink="/register">Create one</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { display: flex; min-height: 100vh; }
    .login-hero {
      flex: 1; background: linear-gradient(135deg, #0a1628 0%, #0f1a3a 40%, #162255 100%);
      display: flex; align-items: center; justify-content: center; padding: 60px;
      position: relative; overflow: hidden;
    }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .shape { position: absolute; border-radius: 50%; opacity: 0.15; }
    .shape-1 { width: 600px; height: 600px; top: -200px; right: -200px; background: radial-gradient(circle, #f59e0b, transparent); animation: float 12s ease-in-out infinite; }
    .shape-2 { width: 400px; height: 400px; bottom: -100px; left: -100px; background: radial-gradient(circle, #3b82f6, transparent); animation: float 16s ease-in-out infinite reverse; }
    .shape-3 { width: 200px; height: 200px; top: 40%; left: 20%; background: radial-gradient(circle, #f59e0b, transparent); animation: float 10s ease-in-out infinite 2s; }
    .shape-4 { width: 150px; height: 150px; top: 20%; right: 30%; background: radial-gradient(circle, #10b981, transparent); animation: float 14s ease-in-out infinite 1s; }
    .hero-content { max-width: 480px; position: relative; z-index: 1; }
    .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
    .brand-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 24px; color: #0a1628; box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
    .brand-text { display: flex; flex-direction: column; }
    .brand-name { font-size: 22px; font-weight: 800; color: white; letter-spacing: 1px; }
    .brand-sub { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase; }
    .hero-title { font-size: 44px; font-weight: 700; color: white; line-height: 1.15; margin: 0 0 20px; letter-spacing: -0.5px; }
    .hero-desc { color: rgba(255,255,255,0.55); line-height: 1.7; font-size: 16px; margin-bottom: 48px; }
    .hero-stats { display: flex; gap: 40px; }
    .stat { display: flex; flex-direction: column; }
    .stat-value { font-size: 20px; font-weight: 700; color: white; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
    .login-form-section { width: 480px; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 40px; }
    .login-form-wrap { width: 100%; max-width: 380px; }
    .form-header { margin-bottom: 36px; }
    .form-header h2 { font-size: 28px; font-weight: 700; color: var(--text); margin: 0 0 8px; letter-spacing: -0.5px; }
    .form-header p { color: var(--text-secondary); font-size: 15px; margin: 0; }
    .field { margin-bottom: 22px; }
    .field label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap i { position: absolute; left: 16px; color: var(--text-muted); font-size: 14px; pointer-events: none; }
    .input-wrap input { width: 100%; padding: 14px 16px 14px 44px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 15px; transition: var(--transition); background: var(--surface); box-sizing: border-box; color: var(--text); }
    .input-wrap input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(15,26,58,0.08); }
    .input-wrap input::placeholder { color: var(--text-muted); }
    .btn-login { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; }
    .btn-login:hover:not(:disabled) { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,26,58,0.25); }
    .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
    .form-footer { text-align: center; margin-top: 28px; font-size: 14px; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 4px; }
    .form-footer a { color: var(--primary); text-decoration: none; font-weight: 600; transition: var(--transition); }
    .form-footer a:hover { color: var(--primary-light); }
    @media (max-width: 900px) { .login-hero { display: none; } .login-form-section { width: 100%; } }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  username = '';
  password = '';

  onLogin() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        const msg = err.error?.message || err.error?.error || 'Invalid credentials';
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }
}
