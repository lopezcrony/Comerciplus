import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router, private http: HttpClient) {}

  toggleSidebarVisibility() {
    this.toggleSidebar.emit();
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('/api/auth/logout', {}, { headers }).subscribe(
        (response) => {
          console.log('Logout exitoso', response);
          this.clearLocalStorageAndRedirect();
        },
        (error) => {
          console.error('Error en logout', error);
          // Aún así, limpiamos el almacenamiento local y redirigimos
          this.clearLocalStorageAndRedirect();
        }
      );
    } else {
      console.log('No hay token almacenado');
      this.router.navigate(['/']);
    }
  }

  private clearLocalStorageAndRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Si almacenas información del usuario
    this.router.navigate(['/']);
  }
}