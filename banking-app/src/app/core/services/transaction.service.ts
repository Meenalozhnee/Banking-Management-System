import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction, AmountRequest, TransferRequest } from '../../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  deposit(account: string, req: AmountRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.api}/transactions/${account}/deposit`, req);
  }

  withdraw(account: string, req: AmountRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.api}/transactions/${account}/withdraw`, req);
  }

  transfer(req: TransferRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.api}/transactions/transfer`, req);
  }

  getHistory(account: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.api}/transactions/${account}/history`, { params });
  }

  getAllByUser(page = 0, size = 50): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.api}/transactions/all`, { params });
  }

  downloadStatement(account: string): Observable<Blob> {
    return this.http.get(`${this.api}/transactions/${account}/statement.pdf`, {
      responseType: 'blob'
    });
  }
}
