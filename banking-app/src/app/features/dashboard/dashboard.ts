import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from '../../core/services/account.service';
import { TransactionService } from '../../core/services/transaction.service';
import { FdService } from '../../core/services/fd.service';
import { LoanService } from '../../core/services/loan.service';
import { AuthService } from '../../core/services/auth.service';
import { StateService, AppEvents } from '../../core/services/state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatbotComponent } from '../chatbot/chatbot';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ChatbotComponent],
  template: `
    <div class="dashboard">

      <!-- Top Bar -->
      <div class="top-bar animate-in">
        <div class="greeting">
          <div class="greeting-avatar">{{ userName[0] | uppercase }}</div>
          <div>
            <h1>Good {{ getTimeOfDay() }}, {{ userName }}</h1>
            <p>{{ today | date:'EEEE, MMMM d, y' }}</p>
          </div>
        </div>
        <div class="top-actions">
          <button class="btn-icon" (click)="loadData()" title="Refresh">
            <i class="fas fa-sync-alt"></i>
          </button>
          <a routerLink="/transaction-history" class="btn-icon" title="History">
            <i class="fas fa-clock"></i>
          </a>
        </div>
      </div>

      <!-- Balance Hero -->
      <div class="balance-glass animate-in-d1">
        <div class="glass-glow"></div>
        <div class="glass-shimmer"></div>
        <div class="balance-content">
          <div class="balance-top">
            <div class="balance-label">
              <i class="fas fa-wallet"></i>
              <span>Total Balance</span>
            </div>
            <button type="button" class="eye-toggle-btn" (click)="toggleBalanceVisibility()" aria-label="Toggle balance visibility">
              <i class="fas" [class.fa-eye]="showBalances" [class.fa-eye-slash]="!showBalances"></i>
            </button>
            <div class="balance-badge" *ngIf="accounts.length > 0">
              <i class="fas fa-check-circle"></i> Verified
            </div>
          </div>
          <div class="balance-amount">{{ showBalances ? (totalBalance | currency:'INR') : '••••••••' }}</div>
          <div class="balance-meta">
            <div class="meta-item">
              <span class="meta-num">{{ accounts.length }}</span>
              <span class="meta-label">Accounts</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-num">{{ fdCount }}</span>
              <span class="meta-label">F.Deposits</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-num">{{ loanCount }}</span>
              <span class="meta-label">Loans</span>
            </div>
          </div>
          <div class="balance-actions">
            <a routerLink="/deposit" class="glass-btn glass-btn-primary">
              <i class="fas fa-arrow-down"></i> Deposit
            </a>
            <a routerLink="/transfer" class="glass-btn glass-btn-secondary">
              <i class="fas fa-paper-plane"></i> Transfer
            </a>
            <a routerLink="/withdraw" class="glass-btn glass-btn-secondary">
              <i class="fas fa-arrow-up"></i> Withdraw
            </a>
          </div>
        </div>
        <div class="balance-chart-mini">
          <div class="chart-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" stroke-width="8"
                stroke-dasharray="264" [attr.stroke-dashoffset]="264 * (1 - balanceRatio)"
                stroke-linecap="round" transform="rotate(-90 50 50)"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#fbbf24"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="ring-center">
              <i class="fas fa-indian-rupee-sign"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-row animate-in-d2">
        <div class="stat-modern" *ngFor="let s of stats">
          <div class="stat-modern-icon" [style.background]="s.bg" [style.color]="s.color">
            <i [class]="s.icon"></i>
          </div>
          <div class="stat-modern-info">
            <span class="stat-modern-value">{{ s.value }}</span>
            <span class="stat-modern-label">{{ s.label }}</span>
          </div>
          <div class="stat-sparkline" [style.background]="s.color + '20'">
            <div class="spark-bar" *ngFor="let _ of [1,2,3,4,5,6,7,8]" [style.height]="randomBar()" [style.background]="s.color"></div>
          </div>
        </div>
      </div>

      <!-- Account Balances -->
      <div class="section animate-in-d3">
        <div class="section-header">
          <h2><i class="fas fa-wallet"></i> Account Balances</h2>
          <a routerLink="/accounts" class="section-link">View all accounts <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="account-balance-grid" *ngIf="accounts.length; else noAccountBalances">
          <article class="account-balance-card" *ngFor="let account of accounts; let i = index" [style.animationDelay]="(i * 0.04) + 's'">
            <div class="account-card-header">
              <div>
                <p class="account-card-label">{{ account.accountType || 'Account' }}</p>
                <h3>{{ account.accountNumber }}</h3>
              </div>
              <button type="button" class="account-eye-btn" (click)="account.showBalance = !account.showBalance" aria-label="Toggle balance visibility">
                <i class="fas" [class.fa-eye]="account.showBalance" [class.fa-eye-slash]="!account.showBalance"></i>
              </button>
            </div>
            <p class="account-card-holder">{{ account.accountHolder || 'Account Holder' }}</p>
            <div class="account-balance-row">
              <span>Current Balance</span>
              <strong>{{ (!showBalances && account.showBalance) ? (account.balance | currency:'INR') : '••••••••' }}</strong>
            </div>
            <div class="account-meta-row">
              <span *ngIf="account.branchName"><i class="fas fa-map-marker-alt"></i> {{ account.branchName }}</span>
              <span>{{ account.bankName || 'Primary Bank' }}</span>
            </div>
          </article>
        </div>

        <ng-template #noAccountBalances>
          <div class="empty-state-modern mini-state">
            <div class="empty-orb"><i class="fas fa-wallet"></i></div>
            <h3>No account balances to show</h3>
            <p>Open an account to see each balance listed separately here.</p>
          </div>
        </ng-template>
      </div>

      <!-- Quick Actions -->
      <div class="section animate-in-d3">
        <div class="section-header">
          <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
          <a routerLink="/accounts/new" class="section-link"><i class="fas fa-plus"></i> New Account</a>
        </div>
        <div class="actions-glass-grid">
          <a routerLink="/deposit" class="action-glass">
            <div class="action-glass-icon" style="background:#ecfdf5;color:#10b981;">
              <i class="fas fa-arrow-down"></i>
            </div>
            <span>Deposit</span>
          </a>
          <a routerLink="/withdraw" class="action-glass">
            <div class="action-glass-icon" style="background:#fef2f2;color:#ef4444;">
              <i class="fas fa-arrow-up"></i>
            </div>
            <span>Withdraw</span>
          </a>
          <a routerLink="/transfer" class="action-glass">
            <div class="action-glass-icon" style="background:#eff6ff;color:#3b82f6;">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <span>Transfer</span>
          </a>
          <a routerLink="/fixed-deposits" class="action-glass">
            <div class="action-glass-icon" style="background:#fef3c7;color:#f59e0b;">
              <i class="fas fa-piggy-bank"></i>
            </div>
            <span>FD</span>
          </a>
          <a routerLink="/loans" class="action-glass">
            <div class="action-glass-icon" style="background:#fce7f3;color:#ec4899;">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <span>Loans</span>
          </a>
          <a routerLink="/transaction-history" class="action-glass">
            <div class="action-glass-icon" style="background:#f5f3ff;color:#8b5cf6;">
              <i class="fas fa-history"></i>
            </div>
            <span>History</span>
          </a>
        </div>
      </div>

      <!-- Recent Transactions + Quick Info -->
      <div class="bottom-grid animate-in-d4">
        <div class="section txn-section" *ngIf="recentTxns.length">
          <div class="section-header">
            <h2><i class="fas fa-clock"></i> Recent Transactions</h2>
            <a routerLink="/transaction-history" class="section-link">View All <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="txn-glass-list">
            <div class="txn-glass-item" *ngFor="let t of recentTxns | slice:0:5">
              <div class="txn-glass-icon" [class.credit]="isCredit(t)" [class.debit]="isDebit(t)" [class.transfer]="t.transactionType === 'TRANSFER'">
                <i [class]="txnIcon(t)"></i>
              </div>
              <div class="txn-glass-info">
                <span class="txn-glass-title">{{ t.transactionType | titlecase }}</span>
                <span class="txn-glass-sub">{{ t.description || 'No description' }}</span>
              </div>
              <div class="txn-glass-right">
                <span class="txn-glass-amount" [class.credit]="isCredit(t)" [class.debit]="isDebit(t)">
                  {{ isCredit(t) ? '+' : '-' }}{{ t.amount | currency:'INR' }}
                </span>
                <span class="txn-glass-date">{{ t.transactionDate | date:'dd MMM, h:mm a' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Shimmer -->
      <div class="loading-shimmer" *ngIf="loading && accounts.length === 0">
        <div class="shimmer-card" *ngFor="let _ of [1,2,3]">
          <div class="shimmer-line" style="width:60%"></div>
          <div class="shimmer-line" style="width:40%"></div>
          <div class="shimmer-line" style="width:80%"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state-modern animate-in" *ngIf="!loading && accounts.length === 0">
        <div class="empty-orb">
          <i class="fas fa-wallet"></i>
        </div>
        <h3>No Accounts Yet</h3>
        <p>Open your first account and start your banking journey.</p>
        <a routerLink="/accounts/new" class="btn-glow">Open Account</a>
      </div>
    </div>
    <app-chatbot></app-chatbot>
  `,
  styles: [`
    .dashboard { padding: 8px 0; }

    /* ─── Top Bar ─── */
    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .greeting { display: flex; align-items: center; gap: 14px; }
    .greeting-avatar { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; box-shadow: 0 4px 12px rgba(15,26,58,0.25); }
    .greeting h1 { font-size: 22px; font-weight: 700; color: var(--text); margin: 0; letter-spacing: -0.3px; }
    .greeting p { color: var(--text-secondary); font-size: 13px; margin: 2px 0 0; }
    .top-actions { display: flex; gap: 8px; }
    .btn-icon { width: 40px; height: 40px; border-radius: 12px; border: none; background: var(--surface); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); font-size: 14px; box-shadow: var(--shadow-sm); text-decoration: none; }
    .btn-icon:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15,26,58,0.2); }

    /* ─── Glass Balance Card ─── */
    .balance-glass {
      background: linear-gradient(135deg, #0a1628 0%, #0f1a3a 45%, #1a2d5e 100%);
      border-radius: 20px; padding: 28px 32px; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px;
      box-shadow: 0 8px 32px rgba(15,26,58,0.3);
    }
    .glass-glow { position: absolute; width: 500px; height: 500px; top: -250px; right: -100px; background: radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%); border-radius: 50%; pointer-events: none; }
    .glass-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent); background-size: 200% 100%; animation: shimmer 4s ease-in-out infinite; pointer-events: none; }
    .balance-content { position: relative; z-index: 1; flex: 1; }
    .balance-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .balance-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
    .eye-toggle-btn { border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.08); color: white; width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; margin-left: auto; }
    .eye-toggle-btn:hover { background: rgba(255,255,255,0.14); }
    .balance-label i { font-size: 14px; }
    .balance-badge { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #10b981; background: rgba(16,185,129,0.12); padding: 3px 10px; border-radius: 20px; font-weight: 500; }
    .balance-badge i { font-size: 10px; }
    .balance-amount { font-size: 42px; font-weight: 800; color: white; letter-spacing: -1.5px; margin-bottom: 16px; text-shadow: 0 2px 20px rgba(0,0,0,0.1); }
    .balance-meta { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-num { font-size: 18px; font-weight: 700; color: white; }
    .meta-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
    .meta-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.1); }
    .balance-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .glass-btn { padding: 10px 22px; border-radius: 12px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: var(--transition); cursor: pointer; }
    .glass-btn-primary { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #0a1628; box-shadow: 0 4px 16px rgba(245,158,11,0.3); }
    .glass-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
    .glass-btn-secondary { background: rgba(255,255,255,0.08); color: white; border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(10px); }
    .glass-btn-secondary:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
    .balance-chart-mini { position: relative; z-index: 1; flex-shrink: 0; margin-left: 20px; }
    .chart-ring { position: relative; width: 100px; height: 100px; }
    .chart-ring svg { width: 100%; height: 100%; transform: rotate(0deg); }
    .ring-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; color: rgba(255,255,255,0.6); }

    /* ─── Stats Row ─── */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-modern { background: var(--surface); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden; border: 1px solid var(--border); transition: var(--transition); }
    .stat-modern:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .stat-modern-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .stat-modern-info { display: flex; flex-direction: column; flex: 1; }
    .stat-modern-value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
    .stat-modern-label { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }
    .stat-sparkline { position: absolute; right: 0; bottom: 0; height: 100%; width: 60px; display: flex; align-items: flex-end; gap: 2px; padding: 8px 4px; opacity: 0.3; }
    .spark-bar { width: 5px; border-radius: 3px 3px 0 0; transition: height 0.3s; }

    /* ─── Sections ─── */
    .section { margin-bottom: 28px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-header h2 { font-size: 17px; font-weight: 700; color: var(--text); margin: 0; display: flex; align-items: center; gap: 8px; }
    .dashboard-header { text-align: center; margin-bottom: 24px; }
    .gradient-text { background: linear-gradient(135deg, var(--primary), var(--primary-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .date-text { color: var(--text-secondary); font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: var(--surface); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--border); transition: var(--transition); }
    .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .stat-card .stat-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .stat-card .stat-info { display: flex; flex-direction: column; flex: 1; }
    .stat-card .stat-value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
    .stat-card .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }
    .section-header h2 i { font-size: 15px; color: var(--primary); }
    .section-link { font-size: 13px; color: var(--primary); text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: var(--transition); }
    .section-link:hover { color: var(--accent); gap: 8px; }

    /* ─── Per-Account Balance Cards ─── */
    .account-balance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .account-balance-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 18px; box-shadow: var(--shadow-sm); transition: var(--transition); }
    .account-balance-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .account-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
    .account-card-label { text-transform: uppercase; letter-spacing: 1px; font-size: 11px; color: var(--text-secondary); margin: 0 0 4px; }
    .account-card-header h3 { font-size: 15px; line-height: 1.3; color: var(--text); margin: 0; word-break: break-all; }
    .account-eye-btn { border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); width: 32px; height: 32px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
    .account-eye-btn:hover { background: #f8fafc; color: var(--text); }
    .account-chip { display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; border-radius: 999px; background: #f3f4f6; color: var(--text-muted); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .account-chip.active { background: #ecfdf5; color: #10b981; }
    .account-card-holder { font-size: 13px; color: var(--text-secondary); margin: 0 0 14px; }
    .account-balance-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid var(--border); }
    .account-balance-row span { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    .account-balance-row strong { font-size: 18px; color: var(--text); letter-spacing: -0.4px; }
    .account-meta-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted); margin-top: 8px; flex-wrap: wrap; }
    .account-meta-row i { margin-right: 4px; }
    .mini-state { padding: 28px 18px; }

    /* ─── Quick Actions Glass ─── */
    .actions-glass-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .action-glass { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px 12px; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 12px; transition: var(--transition); cursor: pointer; }
    .action-glass:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .action-glass-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: var(--transition); }
    .action-glass:hover .action-glass-icon { transform: scale(1.1); }
    .action-glass span { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

    /* ─── Bottom Grid ─── */
    .bottom-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }

    /* ─── Transactions ─── */
    .txn-glass-list { background: var(--surface); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
    .txn-glass-item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--border); transition: var(--transition); }
    .txn-glass-item:last-child { border-bottom: none; }
    .txn-glass-item:hover { background: #f8fafc; }
    .txn-glass-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
    .txn-glass-icon.credit { background: linear-gradient(135deg,#ecfdf5,#d1fae5); color: #059669; }
    .txn-glass-icon.debit { background: linear-gradient(135deg,#fef2f2,#fecaca); color: #dc2626; }
    .txn-glass-icon.transfer { background: linear-gradient(135deg,#eff6ff,#bfdbfe); color: #2563eb; }
    .txn-glass-info { flex: 1; display: flex; flex-direction: column; }
    .txn-glass-title { font-size: 14px; font-weight: 600; color: var(--text); }
    .txn-glass-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
    .txn-glass-right { display: flex; flex-direction: column; align-items: flex-end; }
    .txn-glass-amount { font-size: 14px; font-weight: 700; }
    .txn-glass-amount.credit { color: #059669; }
    .txn-glass-amount.debit { color: #dc2626; }
    .txn-glass-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    /* ─── Info Side Cards ─── */
    .info-glass-cards { display: flex; flex-direction: column; gap: 10px; }
    .info-glass-card { background: var(--surface); border-radius: 14px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--border); border-left: 3px solid; transition: var(--transition); }
    .info-glass-card:hover { transform: translateX(4px); box-shadow: var(--shadow); }
    .info-card-icon { font-size: 22px; width: 36px; text-align: center; }
    .info-card-content { display: flex; flex-direction: column; }
    .info-card-label { font-size: 12px; color: var(--text-secondary); }
    .info-card-value { font-size: 18px; font-weight: 700; color: var(--text); margin-top: 1px; }

    /* ─── Loading ─── */
    .loading-shimmer { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .shimmer-card { background: var(--surface); border-radius: 16px; padding: 24px; border: 1px solid var(--border); }
    .shimmer-line { height: 14px; border-radius: 8px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 12px; }
    .shimmer-line:last-child { margin-bottom: 0; }

    /* ─── Empty State ─── */
    .empty-state-modern { text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 20px; border: 1px solid var(--border); }
    .empty-orb { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 28px; color: var(--text-muted); }
    .empty-state-modern h3 { font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 8px; }
    .empty-state-modern p { color: var(--text-secondary); margin: 0 0 24px; font-size: 14px; }
    .btn-glow { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; transition: var(--transition); box-shadow: 0 4px 20px rgba(15,26,58,0.25); }
    .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(15,26,58,0.35); }

    /* ─── Responsive ─── */
    @media (max-width: 1024px) {
      .bottom-grid { grid-template-columns: 1fr; }
      .balance-chart-mini { display: none; }
    }
    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .actions-glass-grid { grid-template-columns: repeat(3, 1fr); }
      .balance-amount { font-size: 32px; }
      .balance-actions { flex-direction: column; }
      .glass-btn { justify-content: center; }
    }
    @media (max-width: 480px) {
      .stats-row { grid-template-columns: 1fr; }
      .actions-glass-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private fdService = inject(FdService);
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private state = inject(StateService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private eventSub?: Subscription;
  private routeSub?: Subscription;

  accounts: any[] = [];
  recentTxns: any[] = [];
  fdCount = 0;
  loanCount = 0;
  totalBalance = 0;
  loading = true;
  userName = '';
  today = new Date();
  showBalances = false;
  stats: { icon: string; value: number | string; label: string; bg: string; color: string }[] = [];

  get balanceRatio() {
    const maxVal = 5000000;
    return Math.min(this.totalBalance / maxVal, 1);
  }

  getTimeOfDay() {
    const h = new Date().getHours();
    return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  }

  isCredit(t: any) {
    return t.transactionType === 'DEPOSIT' || t.transactionType === 'CREDIT';
  }

  isDebit(t: any) {
    return t.transactionType === 'WITHDRAWAL' || t.transactionType === 'DEBIT';
  }

  txnIcon(t: any) {
    if (this.isCredit(t)) return 'fas fa-arrow-down';
    if (this.isDebit(t)) return 'fas fa-arrow-up';
    return 'fas fa-exchange-alt';
  }

  randomBar() {
    return Math.floor(Math.random() * 40 + 20) + 'px';
  }

  constructor() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.sub || 'User';
      } catch { this.userName = 'User'; }
    }
  }

  ngOnInit() {
    this.loadData(false);

    this.routeSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      filter((event) => event.urlAfterRedirects === '/dashboard' || event.urlAfterRedirects.startsWith('/dashboard?'))
    ).subscribe(() => {
      this.loadData(true);
      this.cdr.detectChanges();
    });

    this.eventSub = this.state.onAny(
      AppEvents.ACCOUNT_CREATED, AppEvents.DEPOSIT_COMPLETED,
      AppEvents.WITHDRAW_COMPLETED, AppEvents.TRANSFER_COMPLETED,
      AppEvents.REFRESH_ALL
    ).subscribe(() => this.loadData(true));
  }

  ngOnDestroy() {
    this.eventSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  refreshStats() {
    this.stats = [
      { icon: 'fas fa-landmark', value: this.accounts.length, label: 'Total Accounts', bg: '#eff6ff', color: '#3b82f6' },
      { icon: 'fas fa-piggy-bank', value: this.fdCount, label: 'Fixed Deposits', bg: '#fef3c7', color: '#f59e0b' },
      { icon: 'fas fa-hand-holding-usd', value: this.loanCount, label: 'Active Loans', bg: '#fce7f3', color: '#ec4899' },
      { icon: 'fas fa-arrow-up', value: this.accounts.length > 0 ? 'Active' : '—', label: 'Account Status', bg: '#ecfdf5', color: '#10b981' }
    ];
  }

  toggleBalanceVisibility() {
    this.showBalances = !this.showBalances;
    // Reset all individual account balance visibility regardless of toggle state
    this.accounts.forEach(acc => acc.showBalance = false);
    this.cdr.detectChanges();
  }


  loadData(forceRefresh = false) {
    this.loading = forceRefresh ? (this.accounts.length === 0) : true;
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = (accounts || []).map((acc: any) => ({ ...acc, showBalance: false }));
        this.totalBalance = this.accounts.reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
        this.refreshStats();
        if (this.accounts.length && this.accounts[0].accountNumber) {
          this.transactionService.getHistory(this.accounts[0].accountNumber, 0, 5).subscribe({
            next: (res) => {
              const content = res?.content || res || [];
              this.recentTxns = (content as any[]).slice().reverse();
            }
          });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.fdService.getAll().subscribe({
      next: (fds) => { this.fdCount = (fds || []).filter((f: any) => f.status === 'ACTIVE').length; this.refreshStats(); this.cdr.detectChanges(); }
    });
    this.loanService.getAll().subscribe({
      next: (loans) => {
        const active = (loans || []).filter((l: any) => l.status === 'APPROVED' || l.status === 'ACTIVE');
        this.loanCount = active.length;
        this.refreshStats();
        this.cdr.detectChanges();
      }
    });
  }
}