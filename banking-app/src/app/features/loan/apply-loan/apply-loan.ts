import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../../core/services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Loans</h1>
          <p class="subtitle">Apply for a loan or track existing applications</p>
        </div>
      </div>

      <div class="grid-2col">
        <div class="form-card">
          <h2><i class="fas fa-plus-circle"></i> Apply for Loan</h2>
          <form (ngSubmit)="onApply()" #loanForm="ngForm">
            <div class="loan-types">
              <div class="loan-type" *ngFor="let lt of loanTypes" [class.selected]="loanType === lt.value" (click)="selectLoanType(lt.value)">
                <i class="fas" [class.fa-home]="lt.value==='HOME'" [class.fa-car]="lt.value==='VEHICLE'" [class.fa-graduation-cap]="lt.value==='EDUCATION'" [class.fa-briefcase]="lt.value==='PERSONAL'"></i>
                <span>{{ lt.label }}</span>
              </div>
            </div>
            <div class="input-group">
              <label><i class="fas fa-money-bill-wave"></i> Loan Amount</label>
              <input type="number" name="amount" [(ngModel)]="amount" required min="10000" placeholder="Enter loan amount"/>
            </div>
            <div class="input-group">
              <label><i class="fas fa-calendar-alt"></i> Tenure (months)</label>
              <select name="tenureMonths" [(ngModel)]="tenureMonths" required>
                <option value="" disabled>Select repayment tenure</option>
                <option *ngFor="let t of tenures" [value]="t">{{ t }} months ({{ t/12 }} years)</option>
              </select>
            </div>
            <div class="emi-preview" *ngIf="amount && tenureMonths">
              <div><span>Interest Rate</span> <strong>{{ getRate(loanType) }}% p.a.</strong></div>
              <div><span>Monthly EMI</span> <strong>{{ getEmi() | currency:'INR' }}</strong></div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!loanForm.form.valid">
                <i class="fas fa-check-circle"></i> Apply Now
              </button>
            </div>
          </form>
        </div>

        <div class="table-card">
          <h2><i class="fas fa-list"></i> My Loan Applications</h2>
          <div class="table-container" *ngIf="loans.length">
            <table>
              <thead>
                <tr><th>Type</th><th>Amount</th><th>Tenure</th><th>Rate</th><th>EMI</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let loan of loans">
                  <td><span class="loan-type-badge"><i class="fas" [class.fa-home]="loan.loanType==='HOME'" [class.fa-car]="loan.loanType==='VEHICLE'" [class.fa-graduation-cap]="loan.loanType==='EDUCATION'" [class.fa-briefcase]="loan.loanType==='PERSONAL'"></i> {{ loan.loanType }}</span></td>
                  <td>{{ loan.amount | currency:'INR' }}</td>
                  <td>{{ loan.tenureMonths }}m</td>
                  <td>{{ loan.interestRate || getRate(loan.loanType) }}%</td>
                  <td>{{ (loan.amount / loan.tenureMonths) | currency:'INR' }}</td>
                  <td><span class="badge" [class.approved]="loan.status==='APPROVED'" [class.pending]="loan.status==='PENDING'" [class.rejected]="loan.status==='REJECTED'">{{ loan.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-small" *ngIf="!loans.length">
            <p>No loan applications yet. Apply for one above!</p>
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
    .loan-types { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .loan-type {
      border: 2px solid #e0e0e0; border-radius: 10px; padding: 14px; text-align: center;
      cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .loan-type:hover { border-color: #bbb; }
    .loan-type.selected { border-color: #1a2d5e; background: #f0f4ff; }
    .loan-type i { font-size: 22px; color: #1a2d5e; }
    .loan-type span { font-size: 12px; font-weight: 600; color: #333; }
    .input-group { margin-bottom: 20px; }
    .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 8px; }
    .input-group label i { width: 16px; color: #1a2d5e; }
    .input-group input, .input-group select {
      width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 14px; transition: all 0.2s; background: #fafbfc; box-sizing: border-box;
    }
    .input-group input:focus, .input-group select:focus { border-color: #1a2d5e; outline: none; background: white; box-shadow: 0 0 0 4px rgba(26,45,94,0.08); }
    .emi-preview { background: #f0f4ff; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .emi-preview span { font-size: 12px; color: #888; display: block; }
    .emi-preview strong { font-size: 15px; color: #1a2d5e; }
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
    .loan-type-badge { display: inline-flex; align-items: center; gap: 6px; }
    .loan-type-badge i { font-size: 13px; color: #1a2d5e; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .badge.approved { background: #e8f5e9; color: #2e7d32; }
    .badge.pending { background: #fff8e1; color: #f57f17; }
    .badge.rejected { background: #fbe9e7; color: #c62828; }
    .empty-small { text-align: center; padding: 40px; color: #888; font-size: 14px; }
    @media (max-width: 900px) { .grid-2col { grid-template-columns: 1fr; } }
  `]
})
export class ApplyLoanComponent implements OnInit {
  private loanService = inject(LoanService);
  private snackBar = inject(MatSnackBar);
  loans: any[] = [];
  loanType: 'PERSONAL' | 'HOME' | 'VEHICLE' | 'EDUCATION' | 'BUSINESS' = 'PERSONAL';
  amount = 0;
  tenureMonths = '';
  tenures = [12, 24, 36, 48, 60, 120, 240];
  loanTypes: { value: string; label: string; icon: string }[] = [
    { value: 'HOME', label: 'Home', icon: 'fa-home' },
    { value: 'VEHICLE', label: 'Vehicle', icon: 'fa-car' },
    { value: 'EDUCATION', label: 'Education', icon: 'fa-graduation-cap' },
    { value: 'PERSONAL', label: 'Personal', icon: 'fa-briefcase' }
  ];

  ngOnInit() { this.loanService.getAll().subscribe(data => this.loans = data); }

  selectLoanType(value: string) {
    this.loanType = value as any;
  }

  getRate(type: string): number {
    switch (type) {
      case 'HOME': return 8.5;
      case 'VEHICLE': return 9.0;
      case 'EDUCATION': return 10.5;
      case 'PERSONAL': return 12.0;
      case 'BUSINESS': return 11.0;
      default: return 10.0;
    }
  }

  getEmi(): number {
    const p = this.amount;
    const r = this.getRate(this.loanType) / 100 / 12;
    const n = Number(this.tenureMonths);
    if (p && r && n) return Math.round(p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    return 0;
  }

  onApply() {
    this.loanService.apply({
      loanType: this.loanType,
      amount: this.amount,
      interestRate: this.getRate(this.loanType),
      tenureMonths: Number(this.tenureMonths)
    }).subscribe({
      next: () => {
        this.snackBar.open('Loan application submitted!', 'Close', { duration: 4000 });
        this.amount = 0; this.tenureMonths = '';
        this.loanService.getAll().subscribe(data => this.loans = data);
      },
      error: (err: any) => this.snackBar.open(err.error?.message || 'Failed to apply for loan', 'Close', { duration: 5000 })
    });
  }
}
