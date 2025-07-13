// src/app/shared/services/header.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _showHeader = new BehaviorSubject<boolean>(true);
  showHeader$ = this._showHeader.asObservable();

  setVisibility(show: boolean): void {
    this._showHeader.next(show);
  }
}