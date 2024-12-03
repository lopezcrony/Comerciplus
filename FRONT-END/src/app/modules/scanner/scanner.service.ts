import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/auth.service'; // Asegúrate de que la ruta es correcta

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
      console.log('Evento newBarcode recibido:', data); // Log para verificar
      this.barcodeSubject.next(data);
    });

    // Suscribirse solo a los eventos específicos del usuario
    this.authService.getUserData().subscribe(user => {
      if (user) {
        // Convertir user.idUsuario a cadena
        this.socket.on(user.idUsuario.toString(), (data: any) => {
          console.log(`Evento recibido para el usuario ${user.idUsuario}:`, data); // Log para verificar
          this.barcodeSubject.next(data);
        });
      }
    });
  }

  getLatestBarcode(): Observable<any> {
    return this.barcodeSubject.asObservable();
  }
}
