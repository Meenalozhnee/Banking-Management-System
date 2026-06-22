import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, CreateAccountRequest } from '../../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private api = environment.apiUrl;
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$ = this.accountsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadAccounts(): void {
    if (this.accountsSubject.getValue().length > 0) return; // already loaded
    this.http.get<Account[]>(`${this.api}/accounts`).subscribe({
      next: data => this.accountsSubject.next(data),
      error: err => console.error('Failed to load accounts', err)
    });
  }

  // Force refresh accounts – used after deposit/withdraw/transfer/fd updates
  reloadAccounts(): void {
    this.http.get<Account[]>(`${this.api}/accounts`).subscribe({
      next: data => this.accountsSubject.next(data),
      error: err => console.error('Failed to reload accounts', err)
    });
  }

  getAll(): Observable<Account[]> {
    // Legacy method – still returns HTTP observable (optional)
    return this.http.get<Account[]>(`${this.api}/accounts`);
  }

  getByNumber(number: string): Observable<Account> {
    return this.http.get<Account>(`${this.api}/accounts/${number}`);
  }

  create(req: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(`${this.api}/accounts`, req);
  }

  getBalance(number: string): Observable<any> {
    return this.http.get<any>(`${this.api}/accounts/${number}/balance`);
  }

  close(number: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/accounts/${number}`);
  }
}
