import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Role } from './roles.model';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(roles => console.log('Roles recibidos del servidor:', roles)),
      catchError(this.handleError.bind(this))
    );
  }

  getOneRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  createRoles(role: Role): Observable<Role> {
    console.log('Enviando rol al servidor:', role);
    return this.http.post<Role>(this.apiUrl, role, { headers: this.getHeaders() }).pipe(
      tap(createdRole => console.log('Rol creado en el servidor:', createdRole)),
      catchError(this.handleError.bind(this))
    );
  }

  updateRoles(role: Role): Observable<Role> {
    console.log('Actualizando rol en el servidor:', role);
    return this.http.put<Role>(`${this.apiUrl}/${role.idRol}`, role, { headers: this.getHeaders() }).pipe(
      tap(updatedRole => console.log('Rol actualizado en el servidor:', updatedRole)),
      catchError(this.handleError.bind(this))
    );
  }

  updateStatusRole(id: number, status: boolean): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, { estadoRol: status }, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteRoles(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      this.toastr.error(error.error.message, 'Error');
    } else {
      // Error del lado del servidor
      this.toastr.error(error.error.message, 'Error');
    }
    return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
  }
}