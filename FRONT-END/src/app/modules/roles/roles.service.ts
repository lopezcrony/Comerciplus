import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      catchError(this.handleError)
    );
  }

  getOneRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createRoles(roles: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, roles).pipe(
      catchError(this.handleError)
    );
  }

  updateRoles(roles: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${roles.idRol}`, roles).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusRole(id: number, status: boolean): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, { estadoRol: status }).pipe(
      catchError(this.handleError)
    );
  }

  deleteRoles(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor, intente nuevamente más tarde.');
  }
}
