import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent {
  correoUsuario: string = '';
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  volverALogin() {
    this.router.navigate(['/']);
  }

  validateEmail(): boolean {
    if (!this.emailPattern.test(this.correoUsuario)) {
      this.toastr.error('El correo electrónico debe tener un formato válido');
      return false;
    }
    return true;
  }

  enviarSolicitudRecuperacion() {
    if (!this.validateEmail()) {
      return;
    }

    this.http.post('https://comerciplus-vh7i.onrender.com/recover', { correoUsuario: this.correoUsuario }).subscribe({
      next: ( ) => {
        this.toastr.success('Se han enviado instrucciones para restablecer tu contraseña a tu correo electrónico');
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al enviar la solicitud de recuperación:', error);
        if (error.status === 404) {
          this.toastr.error('No se encontró un usuario con ese correo electrónico');
        } else if (error.status === 0) {
          this.toastr.error('No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté en funcionamiento.');
        } else {
          this.toastr.error('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
        }
      }
    });
  }
}