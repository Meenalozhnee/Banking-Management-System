import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FixedDeposit, CreateFdRequest } from '../../models/fd.model';

@Injectable({ providedIn: 'root' })
export class FdService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FixedDeposit[]> {
    return this.http.get<FixedDeposit[]>(`${this.api}/fixed-deposits`);
  }

  create(req: CreateFdRequest): Observable<FixedDeposit> {
    return this.http.post<FixedDeposit>(`${this.api}/fixed-deposits`, req);
  }

  close(id: number): Observable<FixedDeposit> {
    return this.http.put<FixedDeposit>(`${this.api}/fixed-deposits/${id}/close`, {});
  }
}
