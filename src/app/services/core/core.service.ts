import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';

export interface DeviceResult {
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private remoteEntryLoaded = false;

  public setRemoteEntryLoaded(value: boolean): void {
    this.remoteEntryLoaded = value;
  }
}