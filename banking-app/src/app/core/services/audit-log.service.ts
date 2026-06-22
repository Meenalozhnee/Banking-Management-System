import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLog {
  logId: number;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getAll(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.api}/audit-logs`);
  }
}
