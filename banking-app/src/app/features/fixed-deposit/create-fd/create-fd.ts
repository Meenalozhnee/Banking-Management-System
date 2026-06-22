import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FdService } from '../../../core/services/fd.service';
import { AccountService } from '../../../core/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService, AppEvents } from '../../../core/services/state.service';

@Component({
  selector: 'app-create-fd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Fixed Deposits</h1>
          <p class="subtitle">Invest in fixed deposits with attractive interest rates</p>
        </div>
      </div>

      <div class="grid-2col">
        <div class="form-card">
          <h2><i class="fas fa-plus-circle"></i> Open New FD</h2>
          <form (ngSubmit)="onCreate()" #fdForm="ngForm">
            <div class="input-group">
              <label><i class="fas fa-wallet"></i> Account</label>
              <select name="selectedAccount" [(ngModel)]="selectedAccount" required>
                <option [ngValue]="null" disabled>Select account</option>
                <option *ngFor="let acc of accounts$ | async" [ngValue]="acc">{{ acc.accountNumber }} — {{ acc.accountType }} ({{ acc.balance | currency:'INR' }})</option>
              </select>
            </div>
            <div class="input-group">
              <label><i class="fas fa-money-bill-wave"></i> Deposit Amount</label>
              <input type="number" name="amount" [(ngModel)]="amount" required min="1000" placeholder="Min ₹1,000"/>
            </div>
            <div class="input-group">
              <label><i class="fas fa-calendar-alt"></i> Tenure (months)</label>
              <select name="tenureMonths" [(ngModel)]="tenureMonths" required>
                <option value="" disabled>Select tenure</option>
                <option *ngFor="let t of tenures" [value]="t">{{ t }} months — {{ getRate(t) }}% p.a.</option>
              </select>
            </div>
            <div class="interest-preview" *ngIf="tenureMonths">
              <div><span>Interest Rate</span> <strong>{{ getRate(tenureMonths) }}% p.a.</strong></div>
              <div><span>Maturity Amount</span> <strong>{{ getMaturity() | currency:'INR' }}</strong></div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!fdForm.form.valid">
                <i class="fas fa-check-circle"></i> Create FD
              </button>
            </div>
          </form>
        </div>

        <div class="table-card">
          <h2><i class="fas fa-list"></i> My Fixed Deposits</h2>
          <div class="table-container" *ngIf="fds.length">
            <table>
              <thead>
                <tr><th>FD Number</th><th>Amount</th><th>Tenure</th><th>Rate</th><th>Maturity</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let fd of fds">
                  <td class="mono">{{ fd.fdId || '—' }}</td>
                  <td>{{ fd.amount | currency:'INR' }}</td>
                  <td>{{ fd.tenureMonths }}m</td>
                  <td>{{ fd.interestRate || getRate(fd.tenureMonths) }}%</td>
                  <td>{{ fd.maturityDate | date:'dd MMM yyyy' }}</td>
                  <td><span class="badge" [class.active]="fd.status === 'ACTIVE'" [class.closed]="fd.status === 'CLOSED'">{{ fd.status }}</span></td>
                  <td>
                    <button class="btn-sm" *ngIf="fd.status === 'ACTIVE'" (click)="closeFd(fd.fdId)">
                      <i class="fas fa-times"></i> Close
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-small" *ngIf="!fds.length">
            <p>No fixed deposits yet. Create one to start earning!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .subtitle { color: #888; font-size: 14px; margin: 4px 0 0; }
    .grid-2col { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
    .form-card, .table-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
    .form-card h2, .table-card h2 { font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 20px; display: flex; align-items: center; gap: 10px; }
    .form-card h2 i, .table-card h2 i { color: #1a2d5e; }
    .input-group { margin-bottom: 20px; }
    .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 8px; }
    .input-group label i { width: 16px; color: #1a2d5e; }
    .input-group input, .input-group select {
      width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 14px; transition: all 0.2s; background: #fafbfc; box-sizing: border-box;
    }
    .input-group input:focus, .input-group select:focus { border-color: #1a2d5e; outline: none; background: white; box-shadow: 0 0 0 4px rgba(26,45,94,0.08); }
    .interest-preview { background: #f0f4ff; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .interest-preview span { font-size: 12px; color: #888; display: block; }
    .interest-preview strong { font-size: 15px; color: #1a2d5e; }
    .form-actions { margin-top: 4px; }
    .btn-primary {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #0d1b3e, #1a2d5e);
      color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,27,62,0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #f0f2f5; }
    th { padding: 12px 14px; text-align: left; font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; color: #444; }
    tr:hover td { background: #f8f9fb; }
    .mono { font-family: 'Courier New', monospace; font-weight: 600; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.closed { background: #f5f5f5; color: #888; }
    .btn-sm {
      padding: 5px 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: white;
      cursor: pointer; font-size: 12px; color: #666; transition: all 0.2s;
    }
    .btn-sm:hover { background: #fbe9e7; border-color: #c62828; color: #c62828; }
    .empty-small { text-align: center; padding: 40px; color: #888; font-size: 14px; }
    @media (max-width: 900px) { .grid-2col { grid-template-columns: 1fr; } }
  `]
})
export class CreateFdComponent implements OnInit, OnDestroy {
  private fdService = inject(FdService);
  private accountService = inject(AccountService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private state = inject(StateService);
  private routeSub?: Subscription;
  fds: any[] = [];
  accounts$ = this.accountService.accounts$;
  selectedAccount: any = null;
  amount = 0;
  tenureMonths = '';
  tenures = [3, 6, 12, 24, 36, 60];

    ngOnInit() {
    // Load FDs and accounts immediately on every page activation.
    // Using ActivatedRoute params/data observable guarantees this fires
    // both on first load AND on every subsequent navigation to this route.
    this.loadFds();
    this.accountService.reloadAccounts();

    // Also subscribe so it re-fires if the route params ever change.
    this.routeSub = this.route.params.subscribe(() => {
      this.loadFds();
      this.accountService.reloadAccounts();
    });
  }

  getRate(months: number | string): number {
    if (typeof months === 'string') months = Number(months);
    if (months <= 3) return 5.5;
    if (months <= 6) return 6.0;
    if (months <= 12) return 6.5;
    if (months <= 24) return 7.0;
    if (months <= 36) return 7.5;
    return 8.0;
  }

  getMaturity(): number {
    const rate = this.getRate(Number(this.tenureMonths)) / 100;
    const years = Number(this.tenureMonths) / 12;
    return Math.round(this.amount * (1 + rate * years));
  }

  loadFds() {
    this.fdService.getAll().subscribe(data => {
      this.fds = [...data];
    });
  }

  onCreate() {
    if (!this.selectedAccount) return;
    this.fdService.create({
      accountNumber: this.selectedAccount.accountNumber,
      amount: this.amount,
      interestRate: this.getRate(Number(this.tenureMonths)),
      tenureMonths: Number(this.tenureMonths)
    }).subscribe({
      next: () => {
        this.snackBar.open('Fixed Deposit created successfully!', 'Close', { duration: 4000 });
        this.amount = 0; this.tenureMonths = '';
        this.accountService.reloadAccounts();
        this.selectedAccount = null;
        this.fdService.getAll().subscribe(data => this.fds = data);
        // Notify other components (e.g., dashboard) to refresh FD count
        this.state.emit(AppEvents.REFRESH_ALL);
      },
      error: (err: any) => this.snackBar.open(err.error?.message || 'Failed to create FD', 'Close', { duration: 5000 })
    });
  }

  closeFd(fdId: number) {
    this.fdService.close(fdId).subscribe({
      next: () => {
        this.snackBar.open('FD closed successfully!', 'Close', { duration: 4000 });
        this.fdService.getAll().subscribe(data => this.fds = data);
        // Notify other components to refresh FD count
        this.state.emit(AppEvents.REFRESH_ALL);
      },
      error: (err: any) => this.snackBar.open(err.error?.message || 'Failed to close FD', 'Close', { duration: 5000 })
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

}
