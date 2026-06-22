import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { StateService, AppEvents } from '../../../core/services/state.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Deposit Funds</h1>
        <p class="subtitle">Add money to your account securely</p>
      </div>
      <div class="form-card">
        <div class="form-icon"><i class="fas fa-arrow-down"></i></div>
        <form (ngSubmit)="onSubmit()" #depForm="ngForm">
          <div class="input-group">
            <label><i class="fas fa-wallet"></i> Account</label>
            <select name="selectedAccount" [(ngModel)]="selectedAccount" required>
              <option [ngValue]="null" disabled>Select account</option>
              <option *ngFor="let acc of accounts$ | async" [ngValue]="acc">{{ acc.accountNumber }} — {{ acc.accountType }} ({{ acc.balance | currency:'INR' }})</option>
            </select>
          </div>
          <div class="input-group">
            <label><i class="fas fa-money-bill-wave"></i> Amount</label>
            <input type="number" name="amount" [(ngModel)]="amount" required min="1" placeholder="Enter deposit amount"/>
          </div>
          <div class="input-group">
            <label><i class="fas fa-align-left"></i> Description (Optional)</label>
            <input type="text" name="description" [(ngModel)]="description" placeholder="e.g. Salary deposit"/>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!depForm.form.valid">
              <i class="fas fa-check-circle"></i> Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 560px; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .subtitle { color: #888; font-size: 14px; margin: 4px 0 0; }
    .form-card { background: white; border-radius: 16px; padding: 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); position: relative; }
    .form-icon {
      width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      display: flex; align-items: center; justify-content: center; margin: -56px auto 24px;
      font-size: 24px; color: #2e7d32;
    }
    .input-group { margin-bottom: 22px; }
    .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 8px; }
    .input-group label i { width: 16px; color: #1a2d5e; }
    .input-group input, .input-group select {
      width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 15px; transition: all 0.2s; background: #fafbfc; box-sizing: border-box;
    }
    .input-group input:focus, .input-group select:focus { border-color: #1a2d5e; outline: none; background: white; box-shadow: 0 0 0 4px rgba(26,45,94,0.08); }
    .form-actions { margin-top: 8px; }
    .btn-primary {
      width: 100%; padding: 15px; background: linear-gradient(135deg, #0d1b3e, #1a2d5e);
      color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,27,62,0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class DepositComponent implements OnInit {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private state = inject(StateService);
  private snackBar = inject(MatSnackBar);
  accounts$ = this.accountService.accounts$;
  selectedAccount: any = null;
  amount = 0;
  description = '';

  ngOnInit(): void {
    this.accountService.loadAccounts();
  }

  onSubmit() {
    if (!this.selectedAccount) return;
    this.transactionService.deposit(this.selectedAccount.accountNumber, { amount: this.amount, description: this.description }).subscribe({
      next: () => {
        this.snackBar.open('Deposit successful!', 'Close', { duration: 4000 });
        this.amount = 0;
        this.description = '';
        this.state.emit(AppEvents.DEPOSIT_COMPLETED);
        setTimeout(() => { this.accountService.reloadAccounts(); }, 500);
        this.selectedAccount = null;
      },
      error: (err: any) => this.snackBar.open(err.error?.message || 'Deposit failed', 'Close', { duration: 5000 })
    });
  }
}
