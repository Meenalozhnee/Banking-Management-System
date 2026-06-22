import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <span class="logo">
            <span class="logo-icon"><i class="fas fa-university"></i></span>
            <span class="logo-text">Sorim <span class="logo-light">Bank Hub</span></span>
          </span>
          <span class="divider"></span>
          <span class="tagline">Digital Banking</span>
        </div>
        <div class="nav-right">
          <div class="user-badge">
            <span class="avatar">{{ username.charAt(0).toUpperCase() }}</span>
            <div class="user-meta">
              <span class="user-name">{{ username }}</span>
              <span class="user-role">Customer</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Logout">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar { height: var(--nav-height); background: var(--surface); border-bottom: 1px solid var(--border); position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
    .nav-inner { max-width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 28px; }
    .nav-left { display: flex; align-items: center; gap: 16px; }
    .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--primary); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .logo-text { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: 1px; }
    .logo-light { font-weight: 300; color: var(--text-secondary); }
    .divider { width: 1px; height: 24px; background: var(--border); }
    .tagline { font-size: 13px; color: var(--text-muted); }
    .nav-right { display: flex; align-items: center; gap: 16px; }
    .user-badge { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 34px; height: 34px; border-radius: 8px; background: var(--primary); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .user-meta { display: flex; flex-direction: column; }
    .user-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .user-role { font-size: 11px; color: var(--text-muted); }
    .logout-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid var(--border); background: transparent; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); font-size: 14px; }
    .logout-btn:hover { border-color: #ef4444; color: #ef4444; }
  `]
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);
  username = '';

  constructor() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || 'User';
      } catch { this.username = 'User'; }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
