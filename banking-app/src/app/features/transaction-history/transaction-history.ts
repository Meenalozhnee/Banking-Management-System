import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuditLogService, AuditLog } from '../../core/services/audit-log.service';
import { FormsModule } from '@angular/forms';
import { StateService, AppEvents } from '../../core/services/state.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="filter-bar">
          <label>Start Date: <input type="date" [(ngModel)]="startDate" /></label>
          <label>End Date: <input type="date" [(ngModel)]="endDate" /></label>
          <button class="btn-filter" (click)="applyFilter()">Apply Filter</button>
          <button class="btn-clear" (click)="clearFilter()">Clear</button>
        </div>
        <div>
          <h1>Transaction History</h1>
          <p class="subtitle">Complete log of all your banking activities</p>
        </div>
        <button class="btn-refresh" (click)="loadLogs()"><i class="fas fa-sync-alt"></i> Refresh</button>
      </div>

      <div class="stats-row">
        <div class="stat"><span>Total Activities</span><strong>{{ logs.length }}</strong></div>
        <div class="stat"><span>Deposits</span><strong>{{ countByAction('DEPOSIT') }}</strong></div>
        <div class="stat"><span>Withdrawals</span><strong>{{ countByAction('WITHDRAWAL') }}</strong></div>
        <div class="stat"><span>Transfers</span><strong>{{ countByAction('FUND_TRANSFER') }}</strong></div>
        <div class="stat"><span>Accounts</span><strong>{{ countByAction('ACCOUNT_CREATE') }}</strong></div>
      </div>

      <div class="table-container" *ngIf="logs.length; else empty">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Date & Time</th><th>Action</th><th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of filteredLogs; let i = index">
              <td class="mono">{{ logs.length - i }}</td>
              <td class="date-cell">{{ log.timestamp | date:'dd MMM yyyy, hh:mm a' }}</td>
              <td>
                <span class="action-badge" [class.deposit]="log.action === 'DEPOSIT'" [class.withdrawal]="log.action === 'WITHDRAWAL'" [class.transfer]="log.action === 'FUND_TRANSFER'" [class.account]="log.action === 'ACCOUNT_CREATE' || log.action === 'ACCOUNT_CLOSE'" [class.fd]="log.action?.startsWith('FD')" [class.loan]="log.action?.startsWith('LOAN')" [class.balance]="log.action === 'BALANCE_CHECK'" [class.auth]="log.action === 'LOGIN' || log.action === 'USER_REGISTER'">
                  {{ formatAction(log.action) }}
                </span>
              </td>
              <td>{{ log.details || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <i class="fas fa-history"></i>
          <h3>No Activity Yet</h3>
          <p>Your transaction history will appear here once you start banking.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page { }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .subtitle { color: #888; font-size: 14px; margin: 4px 0 0; }
    .btn-refresh { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; border: 1px solid #e0e0e0; border-radius: 10px; cursor: pointer; font-size: 13px; color: #555; transition: all 0.2s; }
    .btn-refresh:hover { background: #f5f5f5; border-color: #ccc; }
    .btn-refresh i { font-size: 12px; }
    .stats-row { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: white; border-radius: 12px; padding: 14px 20px; min-width: 120px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; }
    .stat span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
    .stat strong { font-size: 22px; font-weight: 700; color: #1a2d5e; margin-top: 4px; }
    .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #f0f2f5; }
    th { padding: 14px 18px; text-align: left; font-weight: 600; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 12px 18px; border-bottom: 1px solid #f0f0f0; color: #444; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8f9fb; }
    .mono { font-family: 'Courier New', monospace; font-weight: 600; color: #888; font-size: 12px; }
    .date-cell { white-space: nowrap; color: #666; font-size: 12px; }
    .action-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .action-badge.deposit { background: #e8f5e9; color: #2e7d32; }
    .action-badge.withdrawal { background: #fbe9e7; color: #c62828; }
    .action-badge.transfer { background: #e3f2fd; color: #1565c0; }
    .action-badge.account { background: #f3e5f5; color: #7b1fa2; }
    .action-badge.fd { background: #fff3e0; color: #e65100; }
    .action-badge.loan { background: #fce4ec; color: #880e4f; }
    .action-badge.balance { background: #e0f2f1; color: #00695c; }
    .action-badge.auth { background: #e8eaf6; color: #283593; }
    .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; }
    .empty-state i { font-size: 48px; color: #ccc; margin-bottom: 16px; }
    .empty-state h3 { font-size: 20px; color: #333; margin: 0 0 8px; }
    .empty-state p { color: #888; margin: 0; }
  `]
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  private auditLogService = inject(AuditLogService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private state = inject(StateService);

  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  startDate: string = '';
  endDate: string = '';
  private routeSub?: Subscription;
  private eventSub?: Subscription;

  ngOnInit() {
    this.loadLogs();

    this.routeSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      filter((event) => event.urlAfterRedirects === '/transaction-history' || event.urlAfterRedirects.startsWith('/transaction-history?'))
    ).subscribe(() => {
      this.loadLogs();
    });

    this.eventSub = this.state.onAny(
      AppEvents.ACCOUNT_CREATED, AppEvents.DEPOSIT_COMPLETED,
      AppEvents.WITHDRAW_COMPLETED, AppEvents.TRANSFER_COMPLETED,
      AppEvents.REFRESH_ALL
    ).subscribe(() => this.loadLogs());
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.eventSub?.unsubscribe();
  }

  loadLogs() {
    this.auditLogService.getAll().subscribe({
      next: (data) => {
        this.logs = data || [];
        this.applyFilter(); // initialize filteredLogs
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      // Include the entire end day
      end.setHours(23, 59, 59, 999);
      this.filteredLogs = this.logs.filter(l => {
        const ts = new Date(l.timestamp);
        return ts >= start && ts <= end;
      });
    } else {
      this.filteredLogs = [...this.logs];
    }
  }

  clearFilter() {
    this.startDate = '';
    this.endDate = '';
    this.filteredLogs = [...this.logs];
  }

  formatAction(action: string): string {
    return action?.replace(/_/g, ' ') || '';
  }

  countByAction(prefix: string): number {
    return this.logs.filter(l => l.action === prefix).length;
  }
}
