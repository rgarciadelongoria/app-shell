import { Component, Host, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ShellActions, ShellErrors, ShellEvents } from '@enums/shell.enum';
import { ScannerService } from '@services/scanner/scanner.service';
import { DeviceService } from '@services/device/device.service';
import { BrowserService } from '@services/browser/browser.service';
import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ConnectionStatus, Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'appShell';

  private showErrorLandingDelay = 10000;
  private latestNetworkStatus: ConnectionStatus | undefined;

  constructor(
    private router: Router,
    private readonly deviceSrv: DeviceService,
    private readonly scannerSrv: ScannerService,
    private readonly browserSrv: BrowserService,
  ) {}

  async ngOnInit(): Promise<void> {
    localStorage.setItem(ShellActions.SHELL_VERSION, '0.0.0');
    localStorage.removeItem(ShellErrors.SHELL_LOADING_REMOTE_OK);
    this.saveCapacitorData();
    setTimeout(() => {
      this.showErrorLanding();
    }, this.showErrorLandingDelay);
  }

  showErrorLanding() {
    const hasErrorLoadingRemote = localStorage.getItem(ShellErrors.SHELL_LOADING_REMOTE_OK) ? false : true;
    if (hasErrorLoadingRemote) {
      this.router.navigate(['/', 'errorLanding']);
    }
  }

  /*
  Device events
  */

  @HostListener(`window:${ShellEvents.SHELL_DEVICE_GET_ID}`, ['$event'])
  async handleShellDeviceGet(event: any) {
    const result = await this.deviceSrv.getId();
    const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_DEVICE_GET_ID_RESPONSE;
    window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(result)));
  }

  /*
  Scanner events
  */

  @HostListener(`window:${ShellEvents.SHELL_SCANNER_REQUEST_PERMISSION}`, ['$event'])
  async handleShellScannerRequestPermission(event: any) {
    try {
      const result = await this.scannerSrv.didUserGrantPermission();
      console.log('Scanner result:', result);
      const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_SCANNER_REQUEST_PERMISSION_RESPONSE;
      window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(result)));
    } catch (error) {
      window.dispatchEvent(new CustomEvent(ShellEvents.SHELL_SCANNER_ERROR, this.createResponseObject(error)));
    }
  }

  @HostListener(`window:${ShellEvents.SHELL_SCANNER_START}`, ['$event'])
  async handleShellScannerStart(event: any) {
    try {
      const resultCallback = (result: any) => {
        console.log('Scanner result:', result);
        const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_SCANNER_RESPONSE;
        window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(result)));
      }

      const result = await this.scannerSrv.startScan(resultCallback);
    } catch (error) {
      window.dispatchEvent(new CustomEvent(ShellEvents.SHELL_SCANNER_ERROR, this.createResponseObject(error)));
    }
  }

  @HostListener(`window:${ShellEvents.SHELL_SCANNER_STOP}`, ['$event'])
  async handleShellScannerStop(event: any) {
    await this.scannerSrv.stopScan();
    const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_SCANNER_RESPONSE;
    const result = { closed: true };
    window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(result)));
  }

  /*
  Browser events
  */

  @HostListener(`window:${ShellEvents.SHELL_BROWSER_OPEN}`, ['$event'])
  async handleShellBrowserOpen(event: any) {
    const url = event.detail?.url;
    await this.browserSrv.openBrowser(url);
    const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_BROWSER_OPEN_RESPONSE;
    const result = { url: event.detail?.url };
    window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(result)));
  }

  /*
  Haptics events
  */

  @HostListener(`window:${ShellEvents.SHELL_VIBRATION}`, ['$event'])
  async handleShellVibration(event: any) {
    const duration = event.detail?.duration || 300;
    await Haptics.vibrate({
      duration
    });
  }

  /*
  Statusbar methods
  */

  @HostListener(`window:${ShellEvents.SHELL_STATUSBAR_SET_STYLE}`, ['$event'])
  async handleShellStatusbarSetStyle(event: any) {
    const style: Style = event.detail?.style || Style.Default;
    await StatusBar.setStyle({ style });
  }

  @HostListener(`window:${ShellEvents.SHELL_STATUSBAR_SET_BACKGROUND_COLOR}`, ['$event'])
  async handleShellStatusbarSetBackgroundColor(event: any) {
    const color = event.detail?.color || '#000000';
    await StatusBar.setBackgroundColor({ color });
  }

  /*
  Network methods
  */

  @HostListener(`window:${ShellEvents.SHELL_NETWORK_GET_CONNECTION}`, ['$event'])
  async handleShellNetworkGetConnection(event: any) {
    const status: ConnectionStatus = await Network.getStatus();
    const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_NETWORK_GET_CONNECTION_RESPONSE;
    window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(status)));
  }

  @HostListener(`window:${ShellEvents.SHELL_NETWORK_ON_CHANGE}`, ['$event'])
  async handleShellNetworkOnChange(event: any) {
    Network.addListener('networkStatusChange', status => {
      if (status.connectionType === this.latestNetworkStatus?.connectionType) {
        return;
      } else {
        this.latestNetworkStatus = status;
      }
      const responseEvent = event.detail?.responseEvent || ShellEvents.SHELL_NETWORK_ON_CHANGE_RESPONSE;
      window.dispatchEvent(new CustomEvent(responseEvent, this.createResponseObject(status)));
    });
  }

  @HostListener(`window:${ShellEvents.SHELL_NETWORK_REMOVE_LISTENERS}`, ['$event'])
  async handleShellNetworkRemoveListeners(event: any) {
    Network.removeAllListeners();
  }

  /*
  Global methods
  */

  private createResponseObject(result: any) {
    return {detail: { "response": result }}
  }

  private saveCapacitorData() {
    const platform = Capacitor.getPlatform();
    localStorage.setItem(ShellActions.SHELL_PLATFORM, platform);
  }
}
