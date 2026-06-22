import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { StateService, AppEvents } from '../../../core/services/state.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Open New Account</h1>
        <p class="subtitle">Choose a bank and account type to get started</p>
      </div>
      <div class="form-card">
        <form (ngSubmit)="onSubmit()" #accForm="ngForm">
          <div class="input-group">
            <label><i class="fas fa-university"></i> Bank Name <span class="required">*</span></label>
            <div class="bank-select-wrapper">
              <input type="text" name="bankName" [(ngModel)]="bankName" required
                placeholder="Search or type bank name" (focus)="showBankDropdown = true"
                (blur)="hideDropdown()" (input)="filterBanks()" class="bank-input"/>
              <div class="bank-dropdown" *ngIf="showBankDropdown && filteredBanks.length">
                <button type="button" class="bank-option" *ngFor="let b of filteredBanks"
                  (mousedown)="selectBank(b)">
                  <i class="fas fa-university"></i> {{ b }}
                </button>
              </div>
            </div>
          </div>
          <div class="account-type-selector">
            <div class="type-option" [class.selected]="accountType === 'SAVINGS'" (click)="accountType='SAVINGS'">
              <i class="fas fa-piggy-bank"></i>
              <strong>Savings Account</strong>
              <span>3.5% interest rate, zero balance</span>
            </div>
            <div class="type-option" [class.selected]="accountType === 'CURRENT'" (click)="accountType='CURRENT'">
              <i class="fas fa-building"></i>
              <strong>Current Account</strong>
              <span>Ideal for businesses, unlimited txns</span>
            </div>
          </div>
          <div class="input-group">
            <label><i class="fas fa-money-bill-wave"></i> Initial Deposit</label>
            <input type="number" name="initialDeposit" [(ngModel)]="initialDeposit" required min="0" placeholder="0.00"/>
          </div>
          <div class="input-group">
            <label><i class="fas fa-code-branch"></i> Branch</label>
            <input type="text" name="branch" [(ngModel)]="branch" required placeholder="e.g. Main Branch"/>
          </div>
          <div class="input-group">
            <label><i class="fas fa-user"></i> Account Holder Name</label>
            <input type="text" name="accountHolder" [(ngModel)]="accountHolder" required placeholder="John Doe"/>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!accForm.form.valid || !bankName">
              <i class="fas fa-check-circle"></i> Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 640px; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .subtitle { color: #888; font-size: 14px; margin: 4px 0 0; }
    .required { color: #c62828; }
    .form-card { background: white; border-radius: 16px; padding: 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
    .bank-select-wrapper { position: relative; }
    .bank-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; transition: all 0.2s; background: #fafbfc; box-sizing: border-box; }
    .bank-input:focus { border-color: #1a2d5e; outline: none; background: white; box-shadow: 0 0 0 4px rgba(26,45,94,0.08); }
    .bank-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e0e0e0; border-radius: 10px; max-height: 200px; overflow-y: auto; z-index: 10; box-shadow: 0 8px 24px rgba(0,0,0,0.1); margin-top: 4px; }
    .bank-option { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #333; text-align: left; }
    .bank-option:hover { background: #f0f4ff; color: #1a2d5e; }
    .bank-option i { color: #1a2d5e; width: 16px; }
    .account-type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .type-option {
      border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center;
      cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .type-option:hover { border-color: #bbb; }
    .type-option.selected { border-color: #1a2d5e; background: #f0f4ff; }
    .type-option i { font-size: 32px; color: #1a2d5e; }
    .type-option strong { font-size: 15px; color: #333; }
    .type-option span { font-size: 12px; color: #888; }
    .input-group { margin-bottom: 22px; }
    .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 8px; }
    .input-group label i { width: 16px; color: #1a2d5e; }
    .input-group input {
      width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 15px; transition: all 0.2s; background: #fafbfc; box-sizing: border-box;
    }
    .input-group input:focus { border-color: #1a2d5e; outline: none; background: white; box-shadow: 0 0 0 4px rgba(26,45,94,0.08); }
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
export class CreateAccountComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private state = inject(StateService);
  private snackBar = inject(MatSnackBar);
  accountType: 'SAVINGS' | 'CURRENT' = 'SAVINGS';
  initialDeposit = 0;
  branch = '';
  accountHolder = '';
  bankName = '';
  showBankDropdown = false;

  popularBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'Canara Bank',
    'Union Bank of India',
    'Yes Bank',
    'IDBI Bank',
    'Indian Bank',
    'Bank of India',
    'Central Bank of India',
    'Indian Overseas Bank'
  ];

  filteredBanks = [...this.popularBanks];

  filterBanks() {
    const q = this.bankName.toLowerCase();
    this.filteredBanks = this.popularBanks.filter(b => b.toLowerCase().includes(q));
  }

  selectBank(name: string) {
    this.bankName = name;
    this.showBankDropdown = false;
  }

  hideDropdown() {
    setTimeout(() => this.showBankDropdown = false, 200);
  }

  onSubmit() {
    if (!this.bankName.trim()) return;
    this.accountService.create({
      accountType: this.accountType,
      initialDeposit: this.initialDeposit,
      branchName: this.branch,
      bankName: this.bankName,
      accountHolder: this.accountHolder
    }).subscribe({
      next: () => {
        this.snackBar.open('Account created successfully!', 'Close', { duration: 4000 });
        this.state.emit(AppEvents.ACCOUNT_CREATED);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to create account', 'Close', { duration: 5000 })
    });
  }
}
