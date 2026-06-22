import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from '../../../core/services/account.service';
import { StateService, AppEvents } from '../../../core/services/state.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-top animate-in">
        <div>
          <h1>My Accounts</h1>
          <p class="subtitle">View every account, balance, type, and branch in one place.</p>
        </div>
        <div class="page-actions">
          <button class="btn-secondary" type="button" (click)="toggleBalanceVisibility()" title="Show or hide balances">
            <i class="fas" [class.fa-eye]="showBalances" [class.fa-eye-slash]="!showBalances"></i> {{ showBalances ? 'Hide' : 'Show' }} balances
          </button>
          <button class="btn-secondary" type="button" (click)="loadAccounts()" title="Refresh account list">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <a routerLink="/accounts/new" class="btn-primary"><i class="fas fa-plus"></i> Open Account</a>
        </div>
      </div>

      <div class="summary-grid animate-in" *ngIf="accounts.length">
        <article class="summary-card accent-blue">
          <span class="summary-label">Total Balance</span>
          <strong>{{ showBalances ? (totalBalance | currency:'INR') : '••••••••' }}</strong>
          <small>{{ accounts.length }} account(s) in view</small>
        </article>
        <article class="summary-card accent-gold">
          <span class="summary-label">Active Accounts</span>
          <strong>{{ activeAccounts }}</strong>
          <small>Currently available for transactions</small>
        </article>
        <article class="summary-card accent-green">
          <span class="summary-label">Savings / Current</span>
          <strong>{{ savingsCount }} / {{ currentCount }}</strong>
          <small>Split across account types</small>
        </article>
      </div>

      <div class="card-grid" *ngIf="accounts.length">
        <article class="acc-card animate-in" *ngFor="let acc of accounts; let i = index" [style.animationDelay]="(i * 0.06) + 's'">
          <div class="acc-top">
            <div>
              <div class="acc-bank">{{ acc.bankName || 'Primary Bank' }}</div>
              <div class="acc-number">{{ acc.accountNumber }}</div>
            </div>
            <span class="acc-status" [class.active]="acc.status === 'ACTIVE' || !acc.status">{{ acc.status || 'ACTIVE' }}</span>
          </div>

          <div class="acc-holder">{{ acc.accountHolder || 'Account Holder' }}</div>

          <div class="details-grid">
            <div class="detail-box">
              <span>Type</span>
              <strong>{{ acc.accountType || '—' }}</strong>
            </div>
            <div class="detail-box">
              <span>Status</span>
              <strong>{{ acc.status || 'ACTIVE' }}</strong>
            </div>
            <div class="detail-box">
              <span>Balance</span>
              <strong>{{ acc.showBalance ? (acc.balance | currency:'INR') : '••••••••' }}</strong>
            </div>
            <div class="detail-box">
              <span>Branch</span>
              <strong>{{ acc.branchName || 'Main Branch' }}</strong>
            </div>
          </div>

          <div class="acc-bottom">
            <span class="acc-type" [class.savings]="acc.accountType === 'SAVINGS'" [class.current]="acc.accountType === 'CURRENT'">{{ acc.accountType || 'ACCOUNT' }}</span>
            <button type="button" class="eye-toggle-btn" (click)="acc.showBalance = !acc.showBalance" aria-label="Toggle account balances">
              <i class="fas" [class.fa-eye]="acc.showBalance" [class.fa-eye-slash]="!acc.showBalance"></i>
            </button>
          </div>
          <div class="acc-balance-label">Current balance</div>
          <div class="acc-balance">{{ acc.showBalance ? (acc.balance | currency:'INR') : '••••••••' }}</div>
        </article>
      </div>

      <div class="empty-state animate-in" *ngIf="!accounts.length && !loading">
        <div class="empty-icon"><i class="fas fa-wallet"></i></div>
        <h3>No Accounts Yet</h3>
        <p>Open your first account to get started, and it will appear here with its full balance details.</p>
        <a routerLink="/accounts/new" class="btn-primary"><i class="fas fa-plus"></i> Open Account</a>
      </div>

      <div class="empty-state animate-in" *ngIf="loading && !accounts.length">
        <div class="empty-icon"><i class="fas fa-spinner fa-spin"></i></div>
        <h3>Loading accounts…</h3>
        <p>Fetching your accounts and balances.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .page-top h1 { font-size: 24px; font-weight: 700; color: var(--text); margin: 0; letter-spacing: -0.3px; }
    .subtitle { color: var(--text-secondary); font-size: 14px; margin: 4px 0 0; }
    .page-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .btn-primary, .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 9px; font-weight: 600; font-size: 13px; transition: var(--transition); white-space: nowrap; text-decoration: none; border: 1px solid transparent; cursor: pointer; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,26,58,0.2); }
    .btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border); }
    .btn-secondary:hover { background: #f8fafc; transform: translateY(-1px); }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px; }
    .summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: var(--shadow-sm); }
    .summary-card strong { display: block; font-size: 20px; color: var(--text); margin-top: 4px; }
    .summary-card small { color: var(--text-secondary); font-size: 12px; }
    .summary-label { text-transform: uppercase; letter-spacing: 1px; font-size: 11px; color: var(--text-secondary); }
    .summary-card.accent-blue { border-left: 4px solid #3b82f6; }
    .summary-card.accent-gold { border-left: 4px solid #f59e0b; }
    .summary-card.accent-green { border-left: 4px solid #10b981; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
    .acc-card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 18px; transition: var(--transition); }
    .acc-card:hover { border-color: #d1d5db; transform: translateY(-2px); box-shadow: var(--shadow); }
    .acc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
    .acc-bank { font-size: 13px; font-weight: 700; color: var(--text); }
    .acc-status { font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; background: #f3f4f6; color: var(--text-muted); }
    .acc-status.active { background: #ecfdf5; color: #10b981; }
    .acc-number { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: 1px; margin-top: 4px; }
    .acc-holder { font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px; }
    .detail-box { background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; padding: 10px; }
    .detail-box span { display: block; font-size: 11px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .detail-box strong { font-size: 13px; color: var(--text); }
    .acc-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); gap: 8px; }
    .eye-toggle-btn { border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); width: 32px; height: 32px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
    .eye-toggle-btn:hover { background: #f8fafc; color: var(--text); }
    .acc-type { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
    .acc-type.savings { background: #ecfdf5; color: #10b981; }
    .acc-type.current { background: #eff6ff; color: #3b82f6; }
    .acc-balance-label { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    .acc-balance { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; margin-top: 4px; }
    .empty-state { text-align: center; padding: 64px 20px; background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); }
    .empty-icon { width: 56px; height: 56px; border-radius: 14px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; color: var(--text-muted); }
    .empty-state h3 { font-size: 18px; color: var(--text); margin: 0 0 6px; }
    .empty-state p { color: var(--text-secondary); margin: 0 0 20px; font-size: 14px; }
  `]
})
export class AccountListComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private state = inject(StateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private eventSub?: Subscription;
  private routeSub?: Subscription;
  accounts: any[] = [];
  loading = true;
  showBalances = false;

  get totalBalance() {
    return this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }

  get activeAccounts() {
    return this.accounts.filter((acc) => (acc.status || 'ACTIVE') === 'ACTIVE').length;
  }

  get savingsCount() {
    return this.accounts.filter((acc) => acc.accountType === 'SAVINGS').length;
  }

  get currentCount() {
    return this.accounts.filter((acc) => acc.accountType === 'CURRENT').length;
  }

  ngOnInit() {
    this.loadAccounts(false);

    this.routeSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      filter((event) => event.urlAfterRedirects === '/accounts' || event.urlAfterRedirects.startsWith('/accounts?'))
    ).subscribe(() => {
      this.loadAccounts(true);
      this.cdr.detectChanges();
    });

    this.eventSub = this.state.onAny(AppEvents.ACCOUNT_CREATED, AppEvents.REFRESH_ALL).subscribe(() => {
      this.loadAccounts(true);
    });
  }

  ngOnDestroy() {
    this.eventSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  toggleBalanceVisibility() {
    this.showBalances = !this.showBalances;
  }

  loadAccounts(forceRefresh = false) {
    this.loading = forceRefresh ? (this.accounts.length === 0) : true;
    this.accountService.getAll().subscribe({
      next: (data) => {
        this.accounts = (data || []).map((acc: any) => ({ ...acc, showBalance: false }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.accounts = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
