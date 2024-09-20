import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
  
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  validateEmail(): boolean {
    if (!this.emailPattern.test(this.correoUsuario)) {
      this.toastr.error('El correo electrónico debe tener un formato válido');
      return false;
    }
    return true;
  }

  validatePassword(): boolean {
    if (!this.passwordPattern.test(this.claveUsuario)) {
      this.toastr.error('La contraseña debe tener entre 8 y 16 caracteres, incluir al menos una mayúscula, una minúscula y un número');
      return false;
    }
    return true;
  }

  onSubmit() {
    if (!this.validateEmail() || !this.validatePassword()) {
      return;
    }

    const loginData = {
      correoUsuario: this.correoUsuario,
      claveUsuario: this.claveUsuario
    };

    this.http.post('http://localhost:3006/login', loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.toastr.success('Inicio de sesión exitoso');
        this.router.navigate(['/users']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error);
        if (error.status === 401) {
          this.toastr.error('Credenciales incorrectas');
        } else if (error.status === 404) {
          this.toastr.error('Usuario no encontrado');
        } else if (error.status === 0) {
          this.toastr.error('No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté en funcionamiento.');
        } else {
          this.toastr.error('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
        }
      }
    });
  }
}