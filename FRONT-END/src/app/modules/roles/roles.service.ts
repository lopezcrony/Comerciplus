import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Role } from './roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl).pipe(
      tap(roles => console.log('Roles recibidos del servidor:', roles)),
      catchError(this.handleError)
    );
  }

  getOneRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createRoles(role: Role): Observable<Role> {
    console.log('Enviando rol al servidor:', role);
    return this.http.post<Role>(this.apiUrl, role).pipe(
      tap(createdRole => console.log('Rol creado en el servidor:', createdRole)),
      catchError(this.handleError)
    );
  }

  updateRoles(role: Role): Observable<Role> {
    console.log('Actualizando rol en el servidor:', role);
    return this.http.put<Role>(`${this.apiUrl}/${role.idRol}`, role).pipe(
      tap(updatedRole => console.log('Rol actualizado en el servidor:', updatedRole)),
      catchError(this.handleError)
    );
  }

  updateStatusRole(id: number, status: boolean): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, { estadoRol: status }).pipe(
      catchError(this.handleError)
    );
  }

  deleteRoles(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal; por favor, intente nuevamente más tarde.'));
  }
}