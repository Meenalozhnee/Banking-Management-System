import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';

export const AppEvents = {
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  DEPOSIT_COMPLETED: 'DEPOSIT_COMPLETED',
  WITHDRAW_COMPLETED: 'WITHDRAW_COMPLETED',
  TRANSFER_COMPLETED: 'TRANSFER_COMPLETED',
  REFRESH_ALL: 'REFRESH_ALL'
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private events = new Subject<string>();

  emit(event: string) {
    this.events.next(event);
  }

  on(event: string): Observable<string> {
    return this.events.asObservable().pipe(
      filter(e => e === event)
    );
  }

  onAny(...events: string[]): Observable<string> {
    return this.events.asObservable().pipe(
      filter(e => events.includes(e))
    );
  }
}
