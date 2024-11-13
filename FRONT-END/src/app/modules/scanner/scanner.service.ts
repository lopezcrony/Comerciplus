import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScannerSocketService {
  private socket: Socket;
  private barcodeSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.socket = io(environment.apiUrl);
    
    this.socket.on('newBarcode', (data: any) => {
      this.barcodeSubject.next(data);
    });
  }

  getLatestBarcode(): Observable<any> {
    return this.barcodeSubject.asObservable();
  }
}

