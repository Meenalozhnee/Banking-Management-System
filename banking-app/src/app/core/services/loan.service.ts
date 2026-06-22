import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Loan, ApplyLoanRequest } from '../../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.api}/loans`);
  }

  apply(req: ApplyLoanRequest): Observable<Loan> {
    return this.http.post<Loan>(`${this.api}/loans`, req);
  }
}
