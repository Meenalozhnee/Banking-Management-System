import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">Quick Links</div>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" #routerLinkActive="routerLinkActive">
          <i class="fas fa-chart-pie"></i><span>Dashboard</span>
        </a>
        <a routerLink="/accounts" routerLinkActive="active" class="nav-item">
          <i class="fas fa-wallet"></i><span>My Accounts</span>
        </a>
        <a routerLink="/deposit" routerLinkActive="active" class="nav-item">
          <i class="fas fa-arrow-down"></i><span>Deposit</span>
        </a>
        <a routerLink="/withdraw" routerLinkActive="active" class="nav-item">
          <i class="fas fa-arrow-up"></i><span>Withdraw</span>
        </a>
        <a routerLink="/transfer" routerLinkActive="active" class="nav-item">
          <i class="fas fa-exchange-alt"></i><span>Transfer</span>
        </a>
        <a routerLink="/fixed-deposits" routerLinkActive="active" class="nav-item">
          <i class="fas fa-piggy-bank"></i><span>Fixed Deposits</span>
        </a>
        <a routerLink="/loans" routerLinkActive="active" class="nav-item">
          <i class="fas fa-hand-holding-usd"></i><span>Loans</span>
        </a>
        <a routerLink="/transaction-history" routerLinkActive="active" class="nav-item">
          <i class="fas fa-history"></i><span>History</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <i class="fas fa-shield-alt"></i>
        <span>SSL Secured</span>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { width: var(--sidebar-width); background: var(--surface); height: calc(100vh - var(--nav-height)); position: fixed; top: var(--nav-height); left: 0; overflow-y: auto; border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; animation: slideInLeft 0.4s ease; }
    .sidebar-header { padding: 20px 20px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); }
    nav { flex: 1; display: flex; flex-direction: column; padding: 0 10px; gap: 1px; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; color: var(--text-secondary); text-decoration: none; font-size: 14px; border-radius: 8px; transition: var(--transition); }
    .nav-item i { width: 18px; text-align: center; font-size: 15px; color: var(--text-muted); transition: var(--transition); }
    .nav-item:hover { background: #f3f4f6; color: var(--text); }
    .nav-item:hover i { color: var(--primary); }
    .nav-item.active { background: #eef2ff; color: var(--primary); font-weight: 600; }
    .nav-item.active i { color: var(--primary); }
    .sidebar-footer { padding: 14px 20px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
    .sidebar-footer i { font-size: 12px; color: #10b981; }
  `]
})
export class Sidebar {}
