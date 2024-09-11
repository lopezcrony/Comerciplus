import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correoUsuario: string = '';
  claveUsuario: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = ''; // Limpiar mensaje de error previo
    const loginData = {
      correoUsuario: this.correoUsuario,
      claveUsuario: this.claveUsuario
    };

    // Realiza la solicitud POST al backend
    this.http.post('http://localhost:3006/login', loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/users']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error);
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté en funcionamiento.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.';
        }
      }
    });
  }
}