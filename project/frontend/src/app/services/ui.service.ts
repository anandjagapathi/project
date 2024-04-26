import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  private spinnerBehavior = new Subject<boolean>();
  spinnerObserver = this.spinnerBehavior.asObservable();

  private spinnerCount = 0;

  showSpinner() {
    this.spinnerCount++;
    if (this.spinnerCount > 0) this.spinnerBehavior.next(true);
  }

  hideSpinner() {
    this.spinnerCount--;
    if (this.spinnerCount === 0) this.spinnerBehavior.next(false);
  }
}
