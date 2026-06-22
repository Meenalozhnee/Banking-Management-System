import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'accounts', loadComponent: () => import('./features/account/account-list/account-list').then(m => m.AccountListComponent) },
      { path: 'accounts/new', loadComponent: () => import('./features/account/create-account/create-account').then(m => m.CreateAccountComponent) },
      { path: 'deposit', loadComponent: () => import('./features/transaction/deposit/deposit').then(m => m.DepositComponent) },
      { path: 'withdraw', loadComponent: () => import('./features/transaction/withdraw/withdraw').then(m => m.WithdrawComponent) },
      { path: 'transfer', loadComponent: () => import('./features/transaction/transfer/transfer').then(m => m.TransferComponent) },
      { path: 'fixed-deposits', loadComponent: () => import('./features/fixed-deposit/create-fd/create-fd').then(m => m.CreateFdComponent) },
      { path: 'loans', loadComponent: () => import('./features/loan/apply-loan/apply-loan').then(m => m.ApplyLoanComponent) },
      { path: 'transaction-history', loadComponent: () => import('./features/transaction-history/transaction-history').then(m => m.TransactionHistoryComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
