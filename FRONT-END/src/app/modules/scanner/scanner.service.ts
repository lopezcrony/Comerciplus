import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service'; // Asumiendo que tienes un servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class ScannerSocketService {
  private socket: Socket;
  private barcodeSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
    this.socket = io(environment.apiUrl);

    // Suscribirse al evento 'newBarcode' para recibir datos en tiempo real
    this.socket.on('newBarcode', (data: any) => {
      this.barcodeSubject.next(data);
    });

    // Suscribirse solo a los eventos específicos del usuario
    this.authService.getUserData().subscribe(user => {
      if (user) {
        // Convertir user.idUsuario a cadena
        this.socket.on(user.idUsuario.toString(), (data: any) => {
          this.barcodeSubject.next(data);
        });
      }
    });
  }

  getLatestBarcode(): Observable<any> {
    return this.barcodeSubject.asObservable();
  }
}
